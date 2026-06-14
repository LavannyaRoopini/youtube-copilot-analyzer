import logging
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models import Video, KeyPoint, Analysis
from datetime import datetime

logger = logging.getLogger(__name__)

class VideoService:
    @staticmethod
    def create_video(db: Session, url: str, title: str = None, description: str = None, duration: int = None) -> Video:
        """Create a new video record"""
        video = Video(
            url=url,
            title=title,
            description=description,
            duration=duration,
            status="pending"
        )
        db.add(video)
        db.commit()
        db.refresh(video)
        return video

    @staticmethod
    def get_video(db: Session, video_id: str) -> Optional[Video]:
        """Get video by ID"""
        return db.query(Video).filter(Video.id == video_id).first()

    @staticmethod
    def get_video_by_url(db: Session, url: str) -> Optional[Video]:
        """Get video by URL (for checking duplicates)"""
        return db.query(Video).filter(Video.url == url).first()

    @staticmethod
    def get_all_videos(db: Session, skip: int = 0, limit: int = 50) -> List[Video]:
        """Get all videos with pagination"""
        return db.query(Video).offset(skip).limit(limit).all()

    @staticmethod
    def update_video_status(db: Session, video_id: str, status: str, error_message: str = None) -> Video:
        """Update video status"""
        video = VideoService.get_video(db, video_id)
        if video:
            video.status = status
            video.error_message = error_message
            video.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(video)
        return video

    @staticmethod
    def update_video_transcript(db: Session, video_id: str, transcript: str) -> Video:
        """Update video transcript"""
        video = VideoService.get_video(db, video_id)
        if video:
            video.transcript = transcript
            db.commit()
            db.refresh(video)
        return video

class KeyPointService:
    @staticmethod
    def create_keypoint(db: Session, video_id: str, topic: str, timestamp: str, 
                       seconds: int, description: str, confidence: float = 0.95) -> KeyPoint:
        """Create a new key point"""
        keypoint = KeyPoint(
            video_id=video_id,
            topic=topic,
            timestamp=timestamp,
            seconds=seconds,
            description=description,
            confidence=confidence
        )
        db.add(keypoint)
        db.commit()
        db.refresh(keypoint)
        return keypoint

    @staticmethod
    def get_keypoints_by_video(db: Session, video_id: str) -> List[KeyPoint]:
        """Get all key points for a video"""
        return db.query(KeyPoint).filter(KeyPoint.video_id == video_id).order_by(KeyPoint.seconds).all()

    @staticmethod
    def delete_keypoints(db: Session, video_id: str):
        """Delete all key points for a video"""
        db.query(KeyPoint).filter(KeyPoint.video_id == video_id).delete()
        db.commit()

class AnalysisService:
    @staticmethod
    def create_analysis(db: Session, video_id: str, summary: str = None, 
                       tags: List[str] = None, mood: str = None, difficulty: str = None) -> Analysis:
        """Create analysis record"""
        analysis = Analysis(
            video_id=video_id,
            summary=summary,
            tags=tags or [],
            mood=mood,
            difficulty=difficulty
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return analysis

    @staticmethod
    def get_analysis(db: Session, video_id: str) -> Optional[Analysis]:
        """Get analysis for a video"""
        return db.query(Analysis).filter(Analysis.video_id == video_id).first()

    @staticmethod
    def update_analysis(db: Session, video_id: str, summary: str = None, 
                       tags: List[str] = None, mood: str = None, difficulty: str = None) -> Analysis:
        """Update analysis record"""
        analysis = AnalysisService.get_analysis(db, video_id)
        if not analysis:
            analysis = AnalysisService.create_analysis(db, video_id)
        
        if summary:
            analysis.summary = summary
        if tags:
            analysis.tags = tags
        if mood:
            analysis.mood = mood
        if difficulty:
            analysis.difficulty = difficulty
        
        db.commit()
        db.refresh(analysis)
        return analysis
