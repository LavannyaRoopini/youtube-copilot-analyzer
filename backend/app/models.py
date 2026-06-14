from sqlalchemy import Column, String, DateTime, Integer, Float, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class Video(Base):
    __tablename__ = "videos"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    url = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    duration = Column(Integer, nullable=True)  # in seconds
    transcript = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Video {self.id} - {self.title}>"


class KeyPoint(Base):
    __tablename__ = "keypoints"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    video_id = Column(String, nullable=False, index=True)
    topic = Column(String, nullable=False)  # e.g., "Introduction", "Main Concept"
    timestamp = Column(String, nullable=False)  # e.g., "1:23" or "0:45:30"
    seconds = Column(Integer, nullable=False)  # Seconds from start
    description = Column(Text, nullable=False)
    confidence = Column(Float, default=0.95)  # AI confidence score
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<KeyPoint {self.topic} - {self.timestamp}>"


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    video_id = Column(String, nullable=False, index=True)
    raw_analysis = Column(JSON, nullable=True)  # Full AI response
    summary = Column(Text, nullable=True)
    tags = Column(JSON, default=[])  # List of tags
    mood = Column(String, nullable=True)  # Educational, Entertaining, etc.
    difficulty = Column(String, nullable=True)  # Easy, Medium, Hard
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Analysis {self.video_id}>"
