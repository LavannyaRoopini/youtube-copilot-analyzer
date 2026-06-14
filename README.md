# 🎬 YouTube Copilot Analyzer

An intelligent web application that analyzes YouTube videos using AI, extracts key points, and creates interactive clickable timestamps.

## ✨ Features

- 🤖 **AI-Powered Analysis**: Uses OpenAI GPT to understand video content
- ⏱️ **Clickable Timestamps**: Jump to specific moments in the video
- 📝 **Key Points Extraction**: Automatic identification of main topics
- 💾 **Data Persistence**: All analyses saved to database
- 🎨 **Modern UI**: Clean, responsive React interface
- 🚀 **Production Ready**: Fully dockerized and deployable

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+
- Docker & Docker Compose
- OpenAI API Key
- YouTube Data API Key (optional, for extended features)

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

```bash
git clone https://github.com/LavannyaRoopini/youtube-copilot-analyzer.git
cd youtube-copilot-analyzer

# Create .env file
cp .env.example .env
# Edit .env with your API keys

# Build and run
docker-compose up --build
```

App will be available at `http://localhost:3000`

### Option 2: Local Development

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your API keys

python -m uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# YouTube (optional)
YOUTUBE_API_KEY=your_youtube_api_key

# Database
DATABASE_URL=sqlite:///./videos.db

# Backend
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

## 📂 Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── requirements.txt      # Python dependencies
│   ├── app/
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── services.py      # Business logic
│   │   ├── youtube_service.py
│   │   ├── ai_service.py    # OpenAI integration
│   │   └── routes/
│   │       ├── videos.py
│   │       └── analysis.py
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   └── App.tsx          # Main app
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🏃 How It Works

1. **User Input**: Paste a YouTube URL
2. **Transcript Extraction**: Fetch video transcript using YouTube API
3. **AI Analysis**: Send transcript to OpenAI GPT
4. **Key Points Generation**: AI extracts main topics with timestamps
5. **Display**: Show interactive key points with clickable timestamps
6. **Video Playback**: Click any timestamp to jump to that moment

## 🔧 API Endpoints

### POST `/api/analyze`
Analyze a YouTube video

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "id": "uuid",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "title": "Video Title",
  "description": "Video description",
  "duration": 3600,
  "status": "processing",
  "key_points": [],
  "analysis": null,
  "created_at": "2024-01-10T12:00:00",
  "updated_at": "2024-01-10T12:00:00"
}
```

### GET `/api/videos/{id}`
Retrieve analysis results

### GET `/api/videos`
List all analyzed videos with pagination

### GET `/api/status/{video_id}`
Check analysis status

## 🧪 Testing

```bash
cd backend
pytest tests/
```

## 📦 Deployment

### Deploy to Heroku

```bash
heroku create youtube-copilot-analyzer
heroku config:set OPENAI_API_KEY=your_key
heroku config:set YOUTUBE_API_KEY=your_key
heroku config:set DATABASE_URL=your_db_url
git push heroku main
```

### Deploy to AWS EC2

See `DEPLOYMENT.md` for detailed instructions.

### Deploy to Google Cloud Run

See `DEPLOYMENT.md` for detailed instructions.

### Deploy to DigitalOcean

See `DEPLOYMENT.md` for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [YouTube Transcript API](https://github.com/jdepoix/youtube-transcript-api)
- [Docker Documentation](https://docs.docker.com/)

---

**Made with ❤️ by LavannyaRoopini**
