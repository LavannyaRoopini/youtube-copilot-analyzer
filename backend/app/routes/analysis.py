from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/status/{video_id}")
async def check_status(video_id: str, db: Session = Depends(get_db)):
    """
    Check analysis status of a video
    
    - **video_id**: Video ID from analysis endpoint
    """
    from app.services import VideoService
    
    video = VideoService.get_video(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return {
        "video_id": video.id,
        "status": video.status,
        "error": video.error_message
    }
