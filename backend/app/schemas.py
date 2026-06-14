from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class KeyPointResponse(BaseModel):
    id: str
    topic: str
    timestamp: str
    seconds: int
    description: str
    confidence: float

    class Config:
        from_attributes = True

class AnalysisResponse(BaseModel):
    id: str
    summary: Optional[str]
    tags: List[str]
    mood: Optional[str]
    difficulty: Optional[str]

    class Config:
        from_attributes = True

class VideoRequest(BaseModel):
    url: str

class VideoResponse(BaseModel):
    id: str
    url: str
    title: Optional[str]
    description: Optional[str]
    duration: Optional[int]
    status: str
    key_points: List[KeyPointResponse]
    analysis: Optional[AnalysisResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VideoListResponse(BaseModel):
    total: int
    items: List[VideoResponse]

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str]
