import logging
from typing import Optional, Dict, List
import re
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import YouTube

logger = logging.getLogger(__name__)

class YouTubeService:
    @staticmethod
    def extract_video_id(url: str) -> str:
        """Extract video ID from YouTube URL"""
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/embed\/([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/v\/([a-zA-Z0-9_-]{11})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        raise ValueError(f"Invalid YouTube URL: {url}")

    @staticmethod
    def get_video_info(url: str) -> Dict:
        """Get video metadata from YouTube"""
        try:
            video_id = YouTubeService.extract_video_id(url)
            yt = YouTube(url)
            
            return {
                "video_id": video_id,
                "title": yt.title,
                "description": yt.description,
                "duration": yt.length,
                "author": yt.author,
                "views": yt.views,
                "thumbnail_url": yt.thumbnail_url
            }
        except Exception as e:
            logger.error(f"Error fetching video info: {e}")
            raise

    @staticmethod
    def get_transcript(url: str) -> str:
        """Get video transcript from YouTube"""
        try:
            video_id = YouTubeService.extract_video_id(url)
            
            # Try to get transcript in English first
            try:
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            except:
                # If English not available, get the first available transcript
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id).find_transcript('en')
                transcript_list = transcript_list.fetch()
            
            # Combine all transcript entries into single text
            transcript_text = " ".join([entry["text"] for entry in transcript_list])
            return transcript_text
        except Exception as e:
            logger.error(f"Error fetching transcript: {e}")
            raise ValueError(f"Could not fetch transcript for video: {str(e)}")

    @staticmethod
    def get_transcript_with_timestamps(url: str) -> List[Dict]:
        """Get transcript with timestamps"""
        try:
            video_id = YouTubeService.extract_video_id(url)
            
            try:
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            except:
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id).find_transcript('en')
                transcript_list = transcript_list.fetch()
            
            return transcript_list
        except Exception as e:
            logger.error(f"Error fetching transcript with timestamps: {e}")
            raise

    @staticmethod
    def format_timestamp(seconds: float) -> str:
        """Convert seconds to HH:MM:SS or MM:SS format"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        
        if hours > 0:
            return f"{hours}:{minutes:02d}:{secs:02d}"
        else:
            return f"{minutes}:{secs:02d}"
