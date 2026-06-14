# 🚀 Complete Setup and Installation Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (Docker)](#quick-start-docker)
3. [Local Development Setup](#local-development-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### For Local Development
- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm 8+** or **yarn**
- **Git** - [Download](https://git-scm.com/)

### For Docker Deployment
- **Docker 20.10+** - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose 1.29+** - [Install Docker Compose](https://docs.docker.com/compose/install/)

### Required API Keys
1. **OpenAI API Key** - [Get here](https://platform.openai.com/api-keys)
   - Required for AI video analysis
   - Recommended: GPT-4 for better analysis
   - Estimated cost: $0.01-0.05 per video

2. **YouTube API Key** (Optional) - [Get here](https://console.cloud.google.com/apis/library/youtube.googleapis.com)
   - Used for extended metadata
   - Not required for basic functionality

---

## Quick Start (Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/LavannyaRoopini/youtube-copilot-analyzer.git
cd youtube-copilot-analyzer
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

### 3. Edit `.env` File

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4

# Optional: YouTube API Key
YOUTUBE_API_KEY=your_youtube_api_key_here

# Database
DATABASE_URL=sqlite:///./videos.db

# Server URLs
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
PORT=8000

# Environment
ENVIRONMENT=development
DEBUG=True

# CORS Origins
CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]
```

### 4. Build and Run with Docker Compose

```bash
# Build images
docker-compose build

# Start services
docker-compose up
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## Local Development Setup

### Backend Setup

#### 1. Create Python Virtual Environment

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3. Setup Environment Variables

```bash
cp ../.env.example .env
```

Edit `.env` with your API keys

#### 4. Initialize Database

```bash
python -c "from app.database import init_db; init_db()"
```

#### 5. Start Backend Server

```bash
python -m uvicorn main:app --reload
```

Backend will be available at: http://localhost:8000

### Frontend Setup

#### 1. Install Node Dependencies

```bash
cd frontend
npm install
```

#### 2. Setup Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
```

#### 3. Start Development Server

```bash
npm start
```

Frontend will be available at: http://localhost:3000

---

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| OPENAI_API_KEY | OpenAI API key for GPT | sk-... | ✅ Yes |
| OPENAI_MODEL | GPT model version | gpt-4 or gpt-3.5-turbo | ✅ Yes |
| YOUTUBE_API_KEY | YouTube API key | AIza... | ❌ No |
| DATABASE_URL | Database connection string | sqlite:///./videos.db | ✅ Yes |
| BACKEND_URL | Backend URL | http://localhost:8000 | ✅ Yes |
| FRONTEND_URL | Frontend URL | http://localhost:3000 | ✅ Yes |
| PORT | Server port | 8000 | ✅ Yes |
| ENVIRONMENT | Environment type | development/production | ✅ Yes |
| DEBUG | Debug mode | True/False | ❌ No |
| CORS_ORIGINS | CORS allowed origins | ["http://localhost:3000"] | ✅ Yes |

### Frontend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| REACT_APP_API_URL | Backend API URL | http://localhost:8000 | ✅ Yes |
| REACT_APP_API_TIMEOUT | API request timeout (ms) | 30000 | ✅ Yes |

---

## Running the Application

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Running Locally (Development)

#### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn main:app --reload
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

### Accessing the Application

1. **Web Interface**: http://localhost:3000
2. **API Documentation**: http://localhost:8000/docs
3. **API Health Check**: http://localhost:8000/health

---

## Common Issues & Troubleshooting

### Issue: "Port already in use"

**Solution 1: Change the port**
```bash
# Backend
python -m uvicorn main:app --reload --port 8001

# Frontend
npm start -- --port 3001
```

**Solution 2: Kill the process using the port**
```bash
# Find process on port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Issue: "ModuleNotFoundError" in Python

**Solution**: Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Issue: "npm install" fails

**Solution 1**: Clear cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2**: Use npm ci (for exact versions)
```bash
npm ci
```

### Issue: "OpenAI API key not found"

**Solution**: 
1. Create `.env` file in root directory
2. Add: `OPENAI_API_KEY=sk-your-key`
3. Restart the application

### Issue: "Backend connection refused"

**Solution**:
1. Ensure backend is running: http://localhost:8000
2. Check `REACT_APP_API_URL` in frontend `.env.local`
3. Verify CORS settings in backend

### Issue: "Database locked" error

**Solution**:
```bash
# Remove old database
rm backend/videos.db

# Restart application
```

### Issue: Video analysis takes too long

**Causes**:
- Large video transcript
- Slow internet connection
- API rate limiting

**Solutions**:
1. Wait longer (analysis can take 2-5 minutes)
2. Check OpenAI API status
3. Verify API key has sufficient credits

### Issue: "CORS error" in browser console

**Solution**: Update CORS_ORIGINS in `.env`
```env
CORS_ORIGINS=["http://localhost:3000","http://localhost:8000","http://yourdomain.com"]
```

---

## Next Steps

1. ✅ Complete setup
2. ✅ Test the application at http://localhost:3000
3. ✅ Try analyzing a YouTube video
4. ✅ Review deployment guide for production
5. ✅ Check API documentation at http://localhost:8000/docs

---

## Getting Help

- 📖 [Read API Documentation](http://localhost:8000/docs)
- 🐛 [Report Issues on GitHub](https://github.com/LavannyaRoopini/youtube-copilot-analyzer/issues)
- 💬 [GitHub Discussions](https://github.com/LavannyaRoopini/youtube-copilot-analyzer/discussions)
- 🔗 [OpenAI API Docs](https://platform.openai.com/docs)
- 🎓 [FastAPI Docs](https://fastapi.tiangolo.com/)
- ⚛️ [React Docs](https://react.dev/)

---

**Made with ❤️ by LavannyaRoopini**
