# 🚀 Production Deployment Guide for Smart House Locator

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] Supabase database setup
- [x] API endpoints implemented
- [x] Frontend built with Vite
- [x] Production server configuration
- [x] Docker configuration
- [x] Security middleware implemented

### ❌ Still Needed
- [ ] Domain name and SSL certificate
- [ ] Production environment variables
- [ ] Monitoring and logging setup
- [ ] Backup strategy
- [ ] CI/CD pipeline

## 🔧 Production Environment Setup

### 1. Environment Variables

Create a `.env.production` file in the server directory:

```env
# Supabase Configuration
SUPABASE_URL=https://haczfsvknelbvlerkeox.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhY3pmc3ZrbmVsYnZsZXJrZW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzODUzMzQsImV4cCI6MjA3MTk2MTMzNH0.xSX9yt6iv734UqTnMdx3LoA5lGRYugPPEzPqEYRuiYY

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (Update with your domain)
FRONTEND_URL=https://yourdomain.com

# Security - Generate a strong random secret
JWT_SECRET=your_very_long_random_jwt_secret_here_minimum_32_characters

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 2. Generate Strong JWT Secret

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Install Production Dependencies

```bash
cd server
npm install compression
```

## 🌐 Domain and SSL Setup

### 1. Domain Configuration
- Purchase a domain (e.g., `yourdomain.com`)
- Set up DNS records pointing to your server
- Configure subdomain for API (e.g., `api.yourdomain.com`)

### 2. SSL Certificate
- Use Let's Encrypt for free SSL certificates
- Or purchase SSL certificate from your domain provider

## 🐳 Docker Deployment

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose -f docker-compose.production.yml up -d

# Check logs
docker-compose -f docker-compose.production.yml logs -f

# Stop services
docker-compose -f docker-compose.production.yml down
```

### 2. Individual Service Deployment

```bash
# Build backend image
cd server
docker build -f Dockerfile.production -t smart-house-api:latest .

# Run backend container
docker run -d \
  --name smart-house-api \
  -p 5000:5000 \
  --env-file .env.production \
  --restart unless-stopped \
  smart-house-api:latest
```

## 🔒 Security Hardening

### 1. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 2. Environment Variable Security

- Never commit `.env` files to version control
- Use secrets management in production
- Rotate API keys regularly

### 3. Database Security

- Enable Row Level Security (RLS) in Supabase
- Create specific policies for your use case
- Regular database backups

## 📊 Monitoring and Logging

### 1. Application Logging

The production server includes:
- Request/response logging
- Error logging
- Performance metrics

### 2. Health Checks

```bash
# Test API health
curl https://api.yourdomain.com/api/health

# Expected response:
{
  "status": "OK",
  "message": "Smart House Locator API is running with Supabase",
  "database": "Supabase",
  "environment": "production",
  "timestamp": "2024-01-XX...",
  "uptime": 123.45,
  "version": "1.0.0"
}
```

### 3. Monitoring Tools

Consider implementing:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Application monitoring**: New Relic, DataDog
- **Error tracking**: Sentry, LogRocket

## 🔄 CI/CD Pipeline

### 1. GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          npm ci
          cd server && npm ci
          
      - name: Build frontend
        run: npm run build
        
      - name: Deploy to server
        run: |
          # Add your deployment commands here
          echo "Deploying to production..."
```

## 📈 Performance Optimization

### 1. Frontend Optimization
- ✅ Vite build optimization
- ✅ Code splitting
- ✅ Image optimization
- ✅ CDN for static assets

### 2. Backend Optimization
- ✅ Compression middleware
- ✅ Rate limiting
- ✅ Connection pooling
- ✅ Caching strategies

### 3. Database Optimization
- ✅ Proper indexing
- ✅ Query optimization
- ✅ Connection pooling

## 🛡️ Backup Strategy

### 1. Database Backups
- Supabase provides automatic backups
- Set up additional manual backups
- Test restore procedures

### 2. Application Backups
- Version control for code
- Environment configuration backup
- SSL certificate backup

## 🚨 Emergency Procedures

### 1. Rollback Plan
```bash
# Rollback to previous version
docker-compose -f docker-compose.production.yml down
git checkout previous-version
docker-compose -f docker-compose.production.yml up -d
```

### 2. Database Recovery
- Document Supabase recovery procedures
- Keep backup of critical data
- Test recovery process

## 📞 Support and Maintenance

### 1. Regular Maintenance
- [ ] Weekly security updates
- [ ] Monthly dependency updates
- [ ] Quarterly performance reviews
- [ ] Annual security audits

### 2. Monitoring Alerts
- Set up alerts for:
  - Server downtime
  - High error rates
  - Performance degradation
  - Security incidents

## 🎯 Production Checklist

Before going live, ensure:

- [ ] All environment variables are set
- [ ] SSL certificates are installed
- [ ] Domain DNS is configured
- [ ] Firewall rules are in place
- [ ] Monitoring is active
- [ ] Backups are configured
- [ ] Error tracking is set up
- [ ] Performance testing is complete
- [ ] Security audit is passed
- [ ] Documentation is updated

## 🚀 Go Live!

Once everything is configured:

1. **Deploy to production server**
2. **Test all functionality**
3. **Monitor for 24-48 hours**
4. **Announce to users**

Your Smart House Locator is now production-ready! 🎉

---

**Need help?** Check the troubleshooting section or contact support.
