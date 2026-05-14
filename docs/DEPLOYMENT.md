# Deployment Guide

## Deployment Options

### 1. Docker Compose (Local/Development)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

### 2. Docker Hub / Private Registry

#### Build Images

```bash
# Backend
docker build -t your-registry/blog-backend:latest ./backend
docker push your-registry/blog-backend:latest

# Frontend
docker build -t your-registry/blog-frontend:latest ./frontend
docker push your-registry/blog-frontend:latest
```

### 3. Cloud Deployment

#### AWS Deployment

```bash
# ECS/Fargate
# Use AWS CLI to push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker tag blog-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest
```

#### Heroku Deployment

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-blog-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate
```

#### Railway/Render Deployment

- Connect GitHub repository
- Set environment variables
- Auto-deploy on push

### 4. VPS Deployment (DigitalOcean, Linode, etc.)

#### Using Gunicorn + Nginx

```bash
# Install dependencies
sudo apt-get update
sudo apt-get install python3-pip python3-venv nginx

# Clone repository
git clone <repo-url>
cd blog-project

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Setup frontend
cd ../frontend
npm install
npm run build

# Configure Nginx (example)
sudo nano /etc/nginx/sites-available/blog

# Restart Nginx
sudo systemctl restart nginx

# Run Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

## Environment Configuration

### Production Environment Variables

Create `.env` file:

```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost/blog_db
STATIC_URL=/static/
STATIC_ROOT=/app/staticfiles
MEDIA_URL=/media/
MEDIA_ROOT=/app/media
```

## Database

### PostgreSQL Setup

```bash
# Create database
sudo su - postgres
createdb blog_db
createuser blog_user
psql
ALTER USER blog_user WITH PASSWORD 'your-password';
ALTER ROLE blog_user SET client_encoding TO 'utf8';
ALTER ROLE blog_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE blog_user SET default_transaction_deferrable TO on;
ALTER ROLE blog_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;
\q
exit
```

## Static Files & Media

### Collect Static Files

```bash
python manage.py collectstatic --no-input
```

### S3 Bucket (AWS)

```bash
# Install boto3
pip install boto3 django-storages

# Configure settings.py
USE_S3 = os.getenv('USE_S3') == 'True'

if USE_S3:
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME')
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
```

## SSL Certificate

### Let's Encrypt (Nginx)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
sudo systemctl restart nginx
```

## Monitoring & Logging

### Sentry (Error Tracking)

```bash
pip install sentry-sdk

# Configure in settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="https://key@sentry.io/id",
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
)
```

### Logging Configuration

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': '/var/log/blog/django.log',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'INFO',
    },
}
```

## Backup Strategy

### Database Backup

```bash
# PostgreSQL backup
pg_dump blog_db > backup_$(date +%Y%m%d).sql

# Restore
psql blog_db < backup_20240101.sql
```

### Automated Backups (Cron)

```bash
# Edit crontab
crontab -e

# Add daily backup
0 2 * * * pg_dump blog_db > /backups/blog_$(date +\%Y\%m\%d).sql
```

## Performance Optimization

### Caching

```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### CDN Integration

- Use CloudFront for AWS
- Use Cloudflare for general CDN

## Monitoring Checklist

- [ ] Monitor application errors
- [ ] Check server resources (CPU, Memory, Disk)
- [ ] Monitor database performance
- [ ] Check uptime
- [ ] Review logs regularly
- [ ] Test backups
