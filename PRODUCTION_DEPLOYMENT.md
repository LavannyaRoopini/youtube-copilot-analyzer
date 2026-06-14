# 🌍 Production Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Heroku Deployment](#heroku-deployment)
3. [AWS EC2 Deployment](#aws-ec2-deployment)
4. [Google Cloud Run Deployment](#google-cloud-run-deployment)
5. [DigitalOcean Deployment](#digitalocean-deployment)
6. [Azure Deployment](#azure-deployment)
7. [Production Configuration](#production-configuration)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

- ✅ All tests passing locally
- ✅ `.env` file configured with production keys
- ✅ Database migrations applied
- ✅ API endpoints tested
- ✅ Frontend build optimized
- ✅ SSL/HTTPS certificate ready
- ✅ Domain configured
- ✅ Backup strategy in place
- ✅ Monitoring configured
- ✅ Error tracking setup

---

## Heroku Deployment

### 1. Prerequisites

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

heroku login
```

### 2. Create Heroku Apps

```bash
# Create backend app
heroku create youtube-analyzer-api

# Create frontend app (optional - host separately)
heroku create youtube-analyzer
```

### 3. Set Environment Variables

```bash
# Set backend environment variables
heroku config:set -a youtube-analyzer-api \
  OPENAI_API_KEY=sk-your-key \
  YOUTUBE_API_KEY=your-key \
  ENVIRONMENT=production \
  DATABASE_URL=your-db-url
```

### 4. Configure Procfile

Create `Procfile` in root:
```
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 5. Deploy

```bash
git push heroku main
```

### 6. View Logs

```bash
heroku logs --tail -a youtube-analyzer-api
```

---

## AWS EC2 Deployment

### 1. Launch EC2 Instance

1. Go to AWS Console
2. EC2 → Launch Instances
3. Select **Ubuntu 22.04 LTS** (Free tier eligible)
4. Instance type: **t3.medium** or larger
5. Storage: 30GB minimum
6. Security group rules:
   - SSH (22): Your IP only
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - Port 8000: 0.0.0.0/0 (temporary)

### 2. Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### 3. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 4. Clone Repository

```bash
git clone https://github.com/LavannyaRoopini/youtube-copilot-analyzer.git
cd youtube-copilot-analyzer
```

### 5. Setup Environment

```bash
sudo nano .env

# Paste production environment variables
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4
YOUTUBE_API_KEY=your-key
DATABASE_URL=sqlite:///./videos.db
ENVIRONMENT=production
CORS_ORIGINS=["https://yourdomain.com"]
```

### 6. Start Services

```bash
docker-compose up -d
```

### 7. Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/default
```

Add configuration:
```nginx
upstream backend {
    server 127.0.0.1:8000;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80 default_server;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl default_server;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # API proxy
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Create certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Enable auto-renewal
sudo systemctl enable certbot.timer
```

### 9. Restart Nginx

```bash
sudo systemctl restart nginx
```

---

## Google Cloud Run Deployment

### 1. Install Google Cloud SDK

```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### 2. Build Docker Image

```bash
# Configure Docker for GCR
gcloud auth configure-docker

# Build backend image
docker build -t gcr.io/your-project-id/youtube-analyzer-api:latest ./backend

# Push to Container Registry
docker push gcr.io/your-project-id/youtube-analyzer-api:latest
```

### 3. Deploy Backend

```bash
gcloud run deploy youtube-analyzer-api \
  --image gcr.io/your-project-id/youtube-analyzer-api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="OPENAI_API_KEY=sk-your-key,ENVIRONMENT=production"
```

### 4. Deploy Frontend

```bash
# Build frontend
cd frontend
npm run build

# Create Dockerfile.prod
cat > Dockerfile.prod << 'EOF'
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
EOF

# Build and push
docker build -f Dockerfile.prod -t gcr.io/your-project-id/youtube-analyzer:latest .
docker push gcr.io/your-project-id/youtube-analyzer:latest

# Deploy
gcloud run deploy youtube-analyzer \
  --image gcr.io/your-project-id/youtube-analyzer:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## DigitalOcean Deployment

### 1. Create Droplet

1. Create new Droplet
2. Choose **Ubuntu 22.04 x64**
3. Size: $6/month or higher
4. Enable backups

### 2. Connect and Setup

```bash
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 3. Deploy using App Platform (Simpler)

1. Go to DigitalOcean Console
2. Apps → Create App
3. Select GitHub repository
4. Follow the wizard
5. Configure environment variables
6. Deploy

---

## Azure Deployment

### 1. Create Container Registry

```bash
az acr create --resource-group myResourceGroup \
  --name mycontainerregistry --sku Basic
```

### 2. Build and Push Image

```bash
az acr build --registry mycontainerregistry \
  --image youtube-analyzer:latest ./backend
```

### 3. Deploy to Container Instances

```bash
az container create --resource-group myResourceGroup \
  --name youtube-analyzer \
  --image mycontainerregistry.azurecr.io/youtube-analyzer:latest \
  --cpu 2 --memory 1 \
  --environment-variables OPENAI_API_KEY=your-key \
  --ports 8000 \
  --dns-name-label youtube-analyzer
```

---

## Production Configuration

### Environment Variables

```env
# Production Backend
OPENAI_API_KEY=sk-your-production-key
OPENAI_MODEL=gpt-4
YOUTUBE_API_KEY=your-youtube-key
DATABASE_URL=postgresql://user:pass@db.example.com/youtube_db
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
PORT=8000
ENVIRONMENT=production
DEBUG=False
CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
```

### Database

#### PostgreSQL Setup

```sql
CREATE DATABASE youtube_analyzer;
CREATE USER analyzer WITH PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE youtube_analyzer TO analyzer;
```

#### Database URL

```
postgresql://analyzer:strong-password@db-host:5432/youtube_analyzer
```

---

## Monitoring & Maintenance

### Logging

```bash
# View Docker logs
docker-compose logs -f backend

# Heroku logs
heroku logs --tail

# AWS CloudWatch
aws logs tail /aws/ecs/youtube-analyzer --follow
```

### Performance Monitoring

1. **Uptime Monitoring**
   - UptimeRobot: Free tier available
   - Pingdom, StatusPage.io

2. **Error Tracking**
   - Sentry.io integration
   - Datadog, New Relic

3. **Application Performance**
   - New Relic APM
   - DataDog
   - CloudWatch

### Backup Strategy

```bash
# Daily database backups
0 2 * * * pg_dump youtube_db | gzip > /backups/db-$(date +%Y%m%d).sql.gz

# Upload to S3
0 3 * * * aws s3 sync /backups s3://my-backups/youtube-analyzer/
```

### Security

- ✅ Enable HTTPS everywhere
- ✅ Set strong database passwords
- ✅ Use environment variables for secrets
- ✅ Enable CORS properly
- ✅ Rate limiting on API
- ✅ Regular security updates
- ✅ Firewall configuration
- ✅ SSH key-only access

### Cost Optimization

| Service | Cost | Optimization |
|---------|------|---------------|
| Heroku | $7+/month | Use eco dynos |
| AWS EC2 | $10+/month | Use t3 instances |
| Google Cloud Run | Pay-per-use | Free tier available |
| DigitalOcean | $6+/month | Basic droplet |
| Database | $15+/month | Start small, scale up |

---

## Troubleshooting Production

### Issue: High API Response Time

**Solutions**:
1. Check OpenAI API status
2. Implement caching
3. Use CDN for static files
4. Scale horizontally

### Issue: Database Connection Errors

**Solutions**:
1. Check connection string
2. Verify database is running
3. Check firewall rules
4. Increase connection pool size

### Issue: High Memory Usage

**Solutions**:
1. Monitor with: `docker stats`
2. Implement pagination
3. Add caching layer
4. Increase container memory

### Issue: SSL Certificate Errors

**Solutions**:
```bash
# Renew certificate
sudo certbot renew --force-renewal

# Check certificate
ssl-cert-check -c /etc/letsencrypt/live/yourdomain.com/fullchain.pem
```

---

## Rollback Procedure

```bash
# Docker rollback
docker-compose down
git checkout previous-version
docker-compose up -d

# Heroku rollback
heroku releases
heroku rollback v123

# Database migration rollback
alembic downgrade -1
```

---

## Next Steps After Deployment

1. ✅ Test all functionality
2. ✅ Monitor performance
3. ✅ Setup error tracking
4. ✅ Configure backups
5. ✅ Document endpoints
6. ✅ Create runbooks
7. ✅ Setup monitoring alerts
8. ✅ Plan scaling strategy

---

**Made with ❤️ by LavannyaRoopini**
