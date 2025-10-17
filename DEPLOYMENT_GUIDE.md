# Deployment Guide

This guide covers deploying AgriGo 2.0 backend to production environments.

## Pre-Deployment Checklist

- [ ] All environment variables set securely
- [ ] Database backups configured
- [ ] Error logging enabled
- [ ] CORS origins updated for production
- [ ] HTTPS configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Database indexes created
- [ ] All tests passing

## Environment Variables for Production

```env
# Backend
NODE_ENV=production
PORT=5000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Firebase (for chat)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_ADMIN_SDK_KEY=your-admin-sdk-key

# CORS
REACT_APP_FRONTEND_URL=https://yourdomain.com
REACT_APP_BACKEND_URL=https://api.yourdomain.com

# Security
JWT_SECRET=your-jwt-secret-key
API_RATE_LIMIT=100
```

⚠️ **Never commit secrets!** Use environment variable management services.

## Deploying to Heroku

### 1. Create Heroku Account
```bash
# Install Heroku CLI
brew install heroku  # macOS
# or
choco install heroku-cli  # Windows

# Login
heroku login
```

### 2. Create App
```bash
heroku create your-app-name
```

### 3. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=https://...
heroku config:set SUPABASE_ANON_KEY=...
heroku config:set REACT_APP_FRONTEND_URL=https://yourdomain.com
```

### 4. Deploy
```bash
git push heroku main
```

### 5. View Logs
```bash
heroku logs --tail
```

---

## Deploying to AWS

### Option A: EC2 Instance

#### 1. Launch EC2 Instance
- Choose Ubuntu 20.04 LTS
- Allow ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)
- Create and save key pair

#### 2. Connect to Instance
```bash
ssh -i "your-key.pem" ubuntu@your-instance-ip
```

#### 3. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 4. Clone and Setup
```bash
git clone your-repo-url
cd agrigo-2.0
npm install
```

#### 5. Set Environment Variables
```bash
nano .env
# Paste your production environment variables
```

#### 6. Start with PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start backend/src/index.js --name "agrigo-api"
pm2 save
pm2 startup
```

#### 7. Set Up Nginx Reverse Proxy
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

#### 8. Set Up SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

### Option B: AWS Lambda

#### 1. Install SAM CLI
```bash
# macOS
brew install aws-sam-cli

# Windows
choco install aws-sam-cli
```

#### 2. Create SAM Template
Create `template.yaml`:
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 30
    MemorySize: 512

Resources:
  AgriGoApi:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: backend/
      Handler: src/index.handler
      Runtime: nodejs18.x
      Environment:
        Variables:
          SUPABASE_URL: !Ref SupabaseUrl
          SUPABASE_ANON_KEY: !Ref SupabaseKey
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /{proxy+}
            Method: ANY

Parameters:
  SupabaseUrl:
    Type: String
  SupabaseKey:
    Type: String
    NoEcho: true
```

#### 3. Deploy
```bash
sam build
sam deploy --guided
```

---

## Deploying to Railway

### 1. Create Railway Account
Visit https://railway.app and sign up

### 2. Create New Service
- Click "New Service"
- Connect GitHub repository
- Select your repo and branch

### 3. Set Environment Variables
In Railway dashboard:
```
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
REACT_APP_FRONTEND_URL=https://yourdomain.com
```

### 4. Configure Build
Build Command:
```
npm install
```

Start Command:
```
npm start
```

### 5. Deploy
Railway automatically deploys on push

---

## Deploying to Render

### 1. Create Render Account
Visit https://render.com and sign up

### 2. Create New Web Service
- Click "New"
- Select "Web Service"
- Connect GitHub

### 3. Configure Service
- **Name:** agrigo-backend
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 4. Add Environment Variables
Add in Render dashboard:
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

### 5. Deploy
Render automatically deploys on push

---

## Database Migration

### Backup Existing Database
```bash
# Using Supabase CLI
supabase db pull

# This creates a migration file
```

### Run Migrations
```bash
supabase migration up
```

---

## Health Checks

After deployment, verify:

```bash
# Check if server is running
curl https://api.yourdomain.com/health

# Response should be:
# {
#   "success": true,
#   "message": "AgriGo 2.0 Backend is running"
# }
```

---

## Monitoring & Logging

### CloudWatch (AWS)
```bash
# View logs
aws logs tail /aws/lambda/agrigo-api --follow
```

### Sentry (Error Tracking)
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Datadog (Performance Monitoring)
```javascript
const tracer = require('dd-trace').init();
```

---

## SSL/HTTPS

### Let's Encrypt (Free)
```bash
sudo certbot certonly --standalone -d api.yourdomain.com
```

### Auto-renewal
```bash
sudo crontab -e
# Add: 0 0 1 * * certbot renew
```

---

## Scaling

### Horizontal Scaling (Multiple Instances)
Use load balancer (AWS ELB, Nginx, etc.)

### Vertical Scaling
- Increase server memory/CPU
- Increase database capacity

### Database Optimization
- Enable connection pooling
- Add read replicas
- Optimize slow queries

---

## Rollback Strategy

### Using Git
```bash
# Revert to previous commit
git revert <commit-hash>
git push production main
```

### Using Backups
- Heroku: `heroku rollbacks`
- AWS: RDS snapshots
- Render: Automatic backups

---

## Production Checklist

- [ ] Enable HTTPS
- [ ] Set up monitoring (Sentry/Datadog)
- [ ] Configure backups
- [ ] Enable rate limiting
- [ ] Set up CDN for static assets
- [ ] Configure CORS for production origin
- [ ] Enable database backups
- [ ] Set up alerting
- [ ] Test failover procedures
- [ ] Document deployment process
- [ ] Configure auto-scaling
- [ ] Set up API versioning

---

## Performance Optimization

### Caching
```javascript
// Redis caching for frequently accessed resources
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});
```

### Database
- Create indexes on frequently queried columns
- Use connection pooling
- Enable query caching

### API
- Implement pagination
- Add response compression
- Use gzip middleware

---

## Security Hardening

### Headers
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/auth/', limiter);
```

### Input Validation
- Always validate input
- Use joi or zod for schema validation
- Sanitize strings

---

## Support

For deployment issues:
- Check service status pages
- Review application logs
- Consult provider documentation
- Contact support teams

---

## Additional Resources

- [Node.js Deployment Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [OWASP Security Guidelines](https://owasp.org/www-project-secure-coding-practices/)
- [AWS Deployment Guide](https://docs.aws.amazon.com/nodejs/latest/dg/getting-started.html)
