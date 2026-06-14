from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas import VideoResponse, VideoListResponse, VideoRequest, ErrorResponse
from app.services import VideoService, KeyPointService, AnalysisService
from app.youtube_service import YouTubeService
from app.ai_service import AIService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

def process_video_analysis(video_id: str, db: Session):
    """Background task to process video analysis"""
    try:
        video = VideoService.get_video(db, video_id)
        if not video:
            logger.error(f"Video {video_id} not found")
            return

        # Update status to processing
        VideoService.update_video_status(db, video_id, "processing")

        # Get transcript
        logger.info(f"Fetching transcript for {video.url}")
        transcript = YouTubeService.get_transcript(video.url)
        VideoService.update_video_transcript(db, video_id, transcript)

        # Analyze with AI
        logger.info(f"Analyzing transcript for {video_id}")
        ai_service = AIService()
        analysis = ai_service.analyze_transcript(transcript, video.title)

        # Store key points
        video_info = YouTubeService.get_video_info(video.url)
        duration = video_info.get("duration", 0)

        for point in analysis.get("keyPoints", []):
            # Convert percentage to seconds
            seconds = int(duration * point.get("estimatedTimePercent", 0))
            timestamp = YouTubeService.format_timestamp(seconds)

            KeyPointService.create_keypoint(
                db,
                video_id=video_id,
                topic=point.get("topic", ""),
                timestamp=timestamp,
                seconds=seconds,
                description=point.get("description", ""),
                confidence=0.95
            )

        # Store analysis
        AnalysisService.create_analysis(
            db,
            video_id=video_id,
            summary=analysis.get("summary"),
            tags=analysis.get("tags", []),
            mood=analysis.get("mood"),
            difficulty=analysis.get("difficulty")
        )

        # Update status to completed
        VideoService.update_video_status(db, video_id, "completed")
        logger.info(f"Analysis completed for {video_id}")

    except Exception as e:
        logger.error(f"Error processing video {video_id}: {str(e)}")
        VideoService.update_video_status(db, video_id, "failed", str(e))


@router.post("/analyze", response_model=VideoResponse)
async def analyze_video(request: VideoRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Analyze a YouTube video
    
    - **url**: YouTube video URL
    """
    try:
        # Validate URL
        video_id = YouTubeService.extract_video_id(request.url)
        
        # Check if video already exists
        existing = VideoService.get_video_by_url(db, request.url)
        if existing:
            raise HTTPException(status_code=400, detail="Video already analyzed")

        # Get video metadata
        video_info = YouTubeService.get_video_info(request.url)

        # Create video record
        video = VideoService.create_video(
            db,
            url=request.url,
            title=video_info.get("title"),
            description=video_info.get("description"),
            duration=video_info.get("duration")
        )

        # Add background task to process analysis
        background_tasks.add_task(process_video_analysis, video.id, db)

        return VideoResponse(
            id=video.id,
            url=video.url,
            title=video.title,
            description=video.description,
            duration=video.duration,
            status=video.status,
            key_points=[],
            analysis=None,
            created_at=video.created_at,
            updated_at=video.updated_at
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error analyzing video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/videos/{video_id}", response_model=VideoResponse)
async def get_video(video_id: str, db: Session = Depends(get_db)):
    """
    Get video analysis results
    
    - **video_id**: Video ID from analysis endpoint
    """
    video = VideoService.get_video(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    key_points = KeyPointService.get_keypoints_by_video(db, video_id)
    analysis = AnalysisService.get_analysis(db, video_id)

    from app.schemas import AnalysisResponse
    analysis_response = None
    if analysis:
        analysis_response = AnalysisResponse(
            id=analysis.id,
            summary=analysis.summary,
            tags=analysis.tags,
            mood=analysis.mood,
            difficulty=analysis.difficulty
        )

    return VideoResponse(
        id=video.id,
        url=video.url,
        title=video.title,
        description=video.description,
        duration=video.duration,
        status=video.status,
        key_points=[{"id": kp.id, "topic": kp.topic, "timestamp": kp.timestamp, "seconds": kp.seconds, "description": kp.description, "confidence": kp.confidence} for kp in key_points],
        analysis=analysis_response,
        created_at=video.created_at,
        updated_at=video.updated_at
    )


@router.get("/videos", response_model=VideoListResponse)
async def list_videos(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """
    List all analyzed videos
    
    - **skip**: Number of videos to skip (for pagination)
    - **limit**: Maximum number of videos to return
    """
    videos = VideoService.get_all_videos(db, skip, limit)
    from app.schemas import AnalysisResponse
    
    items = []
    for video in videos:
        key_points = KeyPointService.get_keypoints_by_video(db, video.id)
        analysis = AnalysisService.get_analysis(db, video.id)
        
        analysis_response = None
        if analysis:
            analysis_response = AnalysisResponse(
                id=analysis.id,
                summary=analysis.summary,
                tags=analysis.tags,
                mood=analysis.mood,
                difficulty=analysis.difficulty
            )
        
        items.append(VideoResponse(
            id=video.id,
            url=video.url,
            title=video.title,
            description=video.description,
            duration=video.duration,
            status=video.status,
            key_points=[{"id": kp.id, "topic": kp.topic, "timestamp": kp.timestamp, "seconds": kp.seconds, "description": kp.description, "confidence": kp.confidence} for kp in key_points],
            analysis=analysis_response,
            created_at=video.created_at,
            updated_at=video.updated_at
        ))
    
    return VideoListResponse(total=len(items), items=items)
