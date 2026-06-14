# 🔧 API Documentation & Integration Guide

## Base URL

```
http://localhost:8000/api
```

## Interactive API Docs

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Authentication

Currently, no authentication is required. For production, consider:
- API Key authentication
- JWT tokens
- OAuth2

---

## Endpoints

### 1. Analyze Video

**POST** `/analyze`

Analyze a YouTube video and extract key points.

#### Request

```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

#### Request Body

```typescript
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  // YouTube video URL (required)
}
```

#### Response (202 Accepted)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "title": "Video Title",
  "description": "Video description...",
  "duration": 212,
  "status": "pending",
  "key_points": [],
  "analysis": null,
  "created_at": "2024-01-10T12:00:00",
  "updated_at": "2024-01-10T12:00:00"
}
```

#### Status Codes

- `200 OK` - Video already analyzed
- `202 Accepted` - Analysis started
- `400 Bad Request` - Invalid URL
- `500 Internal Server Error` - Server error

#### Python Example

```python
import requests

url = "http://localhost:8000/api/analyze"
payload = {"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}

response = requests.post(url, json=payload)
data = response.json()
print(f"Video ID: {data['id']}")
print(f"Status: {data['status']}")
```

---

### 2. Get Video Details

**GET** `/videos/{video_id}`

Retrieve analysis results for a specific video.

#### Request

```bash
curl http://localhost:8000/api/videos/550e8400-e29b-41d4-a716-446655440000
```

#### Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "title": "Video Title",
  "description": "Video description...",
  "duration": 212,
  "status": "completed",
  "key_points": [
    {
      "id": "point-id-1",
      "topic": "Introduction",
      "timestamp": "0:00",
      "seconds": 0,
      "description": "Introduction to the topic",
      "confidence": 0.95
    },
    {
      "id": "point-id-2",
      "topic": "Main Concept",
      "timestamp": "1:30",
      "seconds": 90,
      "description": "Explanation of main concept",
      "confidence": 0.92
    }
  ],
  "analysis": {
    "id": "analysis-id",
    "summary": "This video explains...",
    "tags": ["education", "tutorial", "programming"],
    "mood": "Educational",
    "difficulty": "Beginner"
  },
  "created_at": "2024-01-10T12:00:00",
  "updated_at": "2024-01-10T12:02:30"
}
```

#### Status Codes

- `200 OK` - Success
- `404 Not Found` - Video not found

#### JavaScript Example

```javascript
const videoId = '550e8400-e29b-41d4-a716-446655440000';
const response = await fetch(`http://localhost:8000/api/videos/${videoId}`);
const data = await response.json();
console.log(data.analysis.summary);
```

---

### 3. List Videos

**GET** `/videos`

Retrieve all analyzed videos with pagination.

#### Request

```bash
curl "http://localhost:8000/api/videos?skip=0&limit=10"
```

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| skip | integer | 0 | Number of videos to skip |
| limit | integer | 50 | Maximum videos to return |

#### Response (200 OK)

```json
{
  "total": 42,
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "title": "Video 1",
      "status": "completed",
      "key_points": [...],
      "analysis": {...}
    },
    // ... more videos
  ]
}
```

#### Pagination Example

```javascript
// Get first page
let skip = 0;
const limit = 10;

const response = await fetch(
  `http://localhost:8000/api/videos?skip=${skip}&limit=${limit}`
);
const data = await response.json();

console.log(`Total videos: ${data.total}`);
console.log(`Current page: ${Math.floor(skip / limit) + 1}`);
```

---

### 4. Check Analysis Status

**GET** `/status/{video_id}`

Check the current analysis status of a video.

#### Request

```bash
curl http://localhost:8000/api/status/550e8400-e29b-41d4-a716-446655440000
```

#### Response (200 OK)

```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "error": null
}
```

#### Status Values

- `pending` - Waiting to be processed
- `processing` - Currently analyzing
- `completed` - Analysis complete
- `failed` - Analysis failed

#### Polling Example

```javascript
async function pollStatus(videoId, maxAttempts = 60) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(
      `http://localhost:8000/api/status/${videoId}`
    );
    const data = await response.json();
    
    console.log(`Status: ${data.status}`);
    
    if (data.status === 'completed') {
      return await fetch(`http://localhost:8000/api/videos/${videoId}`);
    }
    
    if (data.status === 'failed') {
      throw new Error(`Analysis failed: ${data.error}`);
    }
    
    // Wait 2 seconds before next check
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  
  throw new Error('Analysis timeout');
}
```

---

## Data Types

### Video Object

```typescript
interface Video {
  id: string;                    // Unique identifier (UUID)
  url: string;                   // YouTube video URL
  title: string | null;          // Video title
  description: string | null;    // Video description
  duration: number | null;       // Duration in seconds
  status: 'pending' | 'processing' | 'completed' | 'failed';
  key_points: KeyPoint[];        // Array of key points
  analysis: Analysis | null;     // Analysis results
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}
```

### KeyPoint Object

```typescript
interface KeyPoint {
  id: string;           // Unique identifier
  topic: string;        // Topic title
  timestamp: string;    // Format: "MM:SS" or "HH:MM:SS"
  seconds: number;      // Seconds from start
  description: string;  // Detailed description
  confidence: number;   // 0-1 confidence score
}
```

### Analysis Object

```typescript
interface Analysis {
  id: string;                              // Unique identifier
  summary: string | null;                  // Video summary
  tags: string[];                          // Topic tags
  mood: string | null;                     // Content mood/type
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | null;
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid YouTube URL",
  "detail": "URL must be a valid YouTube link"
}
```

### 404 Not Found

```json
{
  "error": "Video not found",
  "detail": "No video with ID: invalid-id"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "detail": "An unexpected error occurred"
}
```

---

## Rate Limiting

Currently no rate limiting. Production deployment should implement:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@limiter.limit("5/minute")
@app.post("/api/analyze")
async def analyze_video(request: VideoRequest):
    ...
```

---

## Webhooks (Future Feature)

Planned webhook support for real-time updates:

```python
@app.post("/api/webhooks/subscribe")
async def subscribe_webhook(webhook_url: str, event: str):
    """
    Subscribe to events:
    - analysis.completed
    - analysis.failed
    """
    pass
```

---

## SDK / Client Libraries

### Python Client

```python
from youtube_analyzer import YouTubeAnalyzer

client = YouTubeAnalyzer('http://localhost:8000')
video = client.analyze('https://youtube.com/watch?v=...')
print(video.analysis.summary)
```

### Node.js Client

```typescript
import { YouTubeAnalyzer } from 'youtube-analyzer';

const client = new YouTubeAnalyzer('http://localhost:8000');
const video = await client.analyze('https://youtube.com/watch?v=...');
console.log(video.analysis.summary);
```

---

## Best Practices

1. **Error Handling**
   ```javascript
   try {
     const response = await fetch('/api/analyze', { method: 'POST' });
     if (!response.ok) {
       const error = await response.json();
       throw new Error(error.detail);
     }
   } catch (error) {
     console.error('Analysis failed:', error.message);
   }
   ```

2. **Polling**
   - Don't poll more frequently than every 2-3 seconds
   - Implement exponential backoff for retries
   - Set maximum retry attempts

3. **Caching**
   ```javascript
   const cache = new Map();
   
   async function getVideo(videoId) {
     if (cache.has(videoId)) {
       return cache.get(videoId);
     }
     
     const data = await fetch(`/api/videos/${videoId}`);
     cache.set(videoId, data);
     return data;
   }
   ```

4. **URL Validation**
   ```javascript
   function isValidYouTubeUrl(url) {
     return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
   }
   ```

---

## Testing

### Using curl

```bash
# Analyze
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtu.be/dQw4w9WgXcQ"}'

# Get video
curl http://localhost:8000/api/videos/{video-id}

# List videos
curl http://localhost:8000/api/videos?limit=5

# Check status
curl http://localhost:8000/api/status/{video-id}
```

### Using Postman

1. Import collection from `docs/postman.json`
2. Set base URL to `http://localhost:8000/api`
3. Run requests

### Using Python

```python
import requests
import time

# Analyze video
url = "https://youtu.be/dQw4w9WgXcQ"
response = requests.post(
    "http://localhost:8000/api/analyze",
    json={"url": url}
)
video = response.json()
video_id = video['id']

# Poll for completion
while True:
    status_response = requests.get(
        f"http://localhost:8000/api/status/{video_id}"
    )
    status = status_response.json()
    
    if status['status'] == 'completed':
        break
    if status['status'] == 'failed':
        print(f"Error: {status['error']}")
        break
    
    print(f"Status: {status['status']}")
    time.sleep(2)

# Get results
results = requests.get(
    f"http://localhost:8000/api/videos/{video_id}"
).json()

print(f"Title: {results['title']}")
print(f"Summary: {results['analysis']['summary']}")
print(f"Key Points: {len(results['key_points'])}")
```

---

**Made with ❤️ by LavannyaRoopini**
