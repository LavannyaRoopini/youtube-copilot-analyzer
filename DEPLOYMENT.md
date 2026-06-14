# Deployment Guide

## Prerequisites

- Docker installed
- Git installed
- API Keys ready (OpenAI, YouTube)
- Target deployment platform account

## Option 1: Heroku Deployment

### Step 1: Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

### Step 2: Create Heroku App

```bash
heroku create your-app-name
```

### Step 3: Set Environment Variables

```bash
heroku config:set OPENAI_API_KEY=your_key
heroku config:set YOUTUBE_API_KEY=your_key
heroku config:set ENVIRONMENT=production
```

### Step 4: Deploy

```bash
git push heroku main
```

## Option 2: AWS EC2 Deployment

### Step 1: Launch EC2 Instance

- Ubuntu 22.04 LTS
- t3.medium or larger
- Security group: Open ports 80, 443, 8000, 3000

### Step 2: Connect and Setup

```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 3: Clone and Deploy

```bash
git clone https://github.com/LavannyaRoopini/youtube-copilot-analyzer.git
cd youtube-copilot-analyzer

# Create .env
sudo nano .env
# Add your keys

# Start services
sudo docker-compose up -d
```

### Step 4: Setup Nginx Reverse Proxy

```bash
sudo apt install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
    }
}
```

```bash
sudo systemctl restart nginx
```

## Option 3: Google Cloud Run

### Step 1: Install GCloud CLI

```bash
curl https://sdk.cloud.google.com | bash
```

### Step 2: Authenticate

```bash
gcloud auth login
gcloud config set project your-project-id
```

### Step 3: Build and Deploy

```bash
# Build image
docker build -t gcr.io/your-project-id/youtube-analyzer:latest ./backend

# Push to Container Registry
docker push gcr.io/your-project-id/youtube-analyzer:latest

# Deploy
gcloud run deploy youtube-analyzer \
  --image gcr.io/your-project-id/youtube-analyzer:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars OPENAI_API_KEY=your_key
```

## Option 4: DigitalOcean App Platform

### Step 1: Connect GitHub

1. Go to DigitalOcean dashboard
2. Apps → Create App → GitHub → Select repository

### Step 2: Configure

Create `app.yaml`:

```yaml
name: youtube-analyzer
services:
  - name: backend
    github:
      repo: LavannyaRoopini/youtube-copilot-analyzer
      branch: main
    build_command: pip install -r requirements.txt
    run_command: uvicorn main:app --host 0.0.0.0 --port 8080
    ports:
      - 8080
    envs:
      - key: OPENAI_API_KEY
        value: ${OPENAI_API_KEY}

  - name: frontend
    github:
      repo: LavannyaRoopini/youtube-copilot-analyzer
      branch: main
    build_command: npm install && npm run build
    run_command: npm start
    ports:
      - 3000
```

## Monitoring & Logs

### View Logs

**Docker:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Heroku:**
```bash
heroku logs --tail
```

**AWS EC2:**
```bash
sudo docker logs container_id
```

## Database Backup

### SQLite

```bash
# Download from production
scp -i your-key.pem ubuntu@your-ip:~/youtube-analyzer/backend/videos.db ./backup/
```

## SSL/HTTPS Setup

### Using Let's Encrypt (AWS/VPS)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### Port Already in Use

```bash
lsof -i :8000
kill -9 <PID>
```

### Container Won't Start

```bash
docker-compose logs backend
```

### Permission Denied

```bash
sudo chmod +x ./backend/main.py
```

## Performance Tips

1. Use environment variables for configuration
2. Enable caching headers
3. Compress API responses
4. Use CDN for static files
5. Monitor API latency
6. Setup auto-scaling if needed
