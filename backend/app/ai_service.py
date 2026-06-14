import logging
import json
from typing import Dict, List, Optional
import os
from openai import OpenAI

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("OPENAI_MODEL", "gpt-4")

    def analyze_transcript(self, transcript: str, video_title: str = "Untitled") -> Dict:
        """
        Analyze video transcript and extract key points
        """
        try:
            prompt = f"""You are an expert at analyzing video content and extracting key points.

Analyze the following video transcript and extract the main key points discussed in the video.

Video Title: {video_title}

Transcript:
{transcript[:3000]}...  (truncated for length)

Please respond with a JSON object containing:
{{
    "summary": "A 1-2 sentence summary of the entire video",
    "keyPoints": [
        {{
            "topic": "Topic title",
            "description": "Description of what is discussed",
            "estimatedTimePercent": 0.15  // Position in video (0-1)
        }}
    ],
    "tags": ["tag1", "tag2", "tag3"],
    "mood": "Educational/Entertaining/Technical/etc",
    "difficulty": "Beginner/Intermediate/Advanced"
}}

Make sure the keyPoints are in chronological order and represent major topics covered.
Limit to 8-12 key points maximum.
Respond ONLY with valid JSON, no additional text."""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )

            # Parse response
            response_text = response.choices[0].message.content
            
            # Clean up response (remove markdown code blocks if present)
            if response_text.startswith("```json"):
                response_text = response_text[7:]  # Remove ```json
            if response_text.startswith("```"):
                response_text = response_text[3:]  # Remove ```
            if response_text.endswith("```"):
                response_text = response_text[:-3]  # Remove ```
            
            analysis = json.loads(response_text.strip())
            return analysis
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in AI response: {e}")
            raise ValueError("Invalid response format from AI")
        except Exception as e:
            logger.error(f"Error analyzing transcript: {e}")
            raise

    def generate_summary(self, transcript: str, max_sentences: int = 3) -> str:
        """
        Generate a concise summary of the transcript
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": f"""Please provide a concise summary of the following transcript in {max_sentences} sentences or less:

{transcript[:2000]}

Respond with ONLY the summary, no additional text."""
                    }
                ],
                temperature=0.7,
                max_tokens=300
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Error generating summary: {e}")
            raise

    def extract_key_phrases(self, transcript: str, num_phrases: int = 10) -> List[str]:
        """
        Extract key phrases/topics from transcript
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": f"""Extract the {num_phrases} most important key phrases or topics from this transcript.
Respond with a JSON array of strings only, like: ["phrase1", "phrase2", ...]
No additional text.

Transcript:
{transcript[:2000]}"""
                    }
                ],
                temperature=0.5,
                max_tokens=300
            )
            
            response_text = response.choices[0].message.content.strip()
            
            # Clean up response
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            return json.loads(response_text.strip())
        except Exception as e:
            logger.error(f"Error extracting key phrases: {e}")
            return []
