# Deployment Guide

This guide covers deploying the Severe Weather Outlook dashboard to various platforms.

## Overview

The application is **static** - it requires no backend, database, or build process. Just upload `index.html` and you're done!

Benefits:
- ✅ Fast deployment
- ✅ Minimal hosting costs
- ✅ High availability
- ✅ Scalable
- ✅ Secure (no backend to compromise)

## GitHub Pages (Recommended)

### Setup (5 minutes)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select source: `main` branch, root folder
   - Click "Save"

3. **Access your site**
   ```
   https://yourusername.github.io/severe-weather-outlook
   ```

### Custom Domain

1. Purchase domain (GoDaddy, Namecheap, etc.)
2. Add DNS records:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
          185.199.109.153
          185.199.110.153
          185.199.111.153
   
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```
3. In GitHub Settings > Pages, add custom domain
4. Enable "Enforce HTTPS"

### Advantages
- ✅ Free hosting
- ✅ GitHub integration
- ✅ Automatic HTTPS
- ✅ CDN included
- ✅ Great uptime

## Netlify

### Setup (5 minutes)

1. **Connect GitHub repository**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Choose GitHub
   - Select repository
   - Click "Deploy"

2. **Configure (optional)**
   - Site settings > Build & deploy
   - No build command needed
   - Publish directory: (empty or `.`)

3. **Access your site**
   ```
   https://your-site-name.netlify.app
   ```

### Custom Domain
- Domain settings > Add custom domain
- Point DNS to Netlify nameservers
- Enable auto HTTPS

### Deploy Updates
- Push to GitHub
- Netlify auto-deploys within seconds

### Advantages
- ✅ Simple setup
- ✅ Auto-deployments
- ✅ Free tier generous
- ✅ Great analytics
- ✅ Form handling available

## Vercel

### Setup (5 minutes)

1. **Connect repository**
   - Go to https://vercel.com
   - Click "New Project"
   - Import GitHub repository
   - Click "Deploy"

2. **Access your site**
   ```
   https://your-project.vercel.app
   ```

3. **Custom domain**
   - Settings > Domains
   - Add custom domain
   - Update DNS records

### Advantages
- ✅ Instant deployments
- ✅ Edge network
- ✅ Excellent performance
- ✅ Analytics included
- ✅ Free tier

## AWS S3 + CloudFront

### Setup (15 minutes)

1. **Create S3 bucket**
   ```bash
   # Using AWS CLI
   aws s3 mb s3://severe-weather-outlook
   
   # Or use AWS Console
   ```

2. **Enable static website hosting**
   ```bash
   # Using AWS CLI
   aws s3 website s3://severe-weather-outlook --index-document index.html
   
   # Or: S3 > Bucket > Properties > Static website hosting
   ```

3. **Upload files**
   ```bash
   aws s3 cp index.html s3://severe-weather-outlook/
   
   # Or sync entire directory
   aws s3 sync . s3://severe-weather-outlook/
   ```

4. **Make files public** (Bucket Policy)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::severe-weather-outlook/*"
       }
     ]
   }
   ```

5. **Set up CloudFront (for HTTPS)**
   - CloudFront > Create distribution
   - Origin: Your S3 website endpoint
   - Enable redirect HTTP → HTTPS
   - Compress objects automatically
   - Create distribution

6. **Add custom domain**
   - CloudFront > Alternate domain names
   - Request SSL certificate (AWS ACM)
   - Update DNS CNAME records

### Cost Estimate
- S3: ~$0.50/month (minimal usage)
- CloudFront: ~$0.085 per GB (first 10GB free)
- Route 53: ~$0.50/month

### Advantages
- ✅ Reliable
- ✅ Scalable
- ✅ CDN included with CloudFront
- ✅ Pay-as-you-go pricing

## Firebase Hosting

### Setup (5 minutes)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase login
   firebase init hosting
   # Choose existing project or create new
   # Public directory: . (current directory)
   # Single-page app: Yes
   ```

3. **Deploy**
   ```bash
   firebase deploy
   ```

4. **Access your site**
   ```
   https://your-project.firebaseapp.com
   ```

### Configuration (.firebaserc)
```json
{
  "projects": {
    "default": "your-project-id"
  },
  "targets": {},
  "etags": {}
}
```

### Advantages
- ✅ Easy setup
- ✅ Free tier
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Google infrastructure

## Azure Static Web Apps

### Setup (10 minutes)

1. **Create resource**
   - Azure Portal > Create resource
   - Search "Static Web App"
   - Click Create

2. **Connect GitHub**
   - Select GitHub account and repository
   - Choose main branch

3. **Configure build**
   - Build presets: (none)
   - App location: (empty)
   - Output location: (empty)

4. **Deploy**
   - Azure creates workflow automatically
   - Deploys on each push

### URL Structure
```
https://your-app.azurestaticapps.net
```

### Advantages
- ✅ Microsoft integration
- ✅ GitHub Actions workflow
- ✅ Free tier available
- ✅ Custom domain support

## Google Cloud Storage

### Setup (10 minutes)

1. **Create bucket**
   ```bash
   gsutil mb gs://severe-weather-outlook
   ```

2. **Enable static website hosting**
   ```bash
   gsutil web set -m index.html gs://severe-weather-outlook
   ```

3. **Upload files**
   ```bash
   gsutil -m cp index.html gs://severe-weather-outlook/
   ```

4. **Make public**
   ```bash
   gsutil iam ch allUsers:objectViewer gs://severe-weather-outlook
   ```

5. **Access**
   ```
   https://storage.googleapis.com/severe-weather-outlook/
   ```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY . .

EXPOSE 8080

CMD ["npx", "http-server", "-p", "8080", "-o"]
```

### Build & Run
```bash
# Build
docker build -t weather-outlook .

# Run locally
docker run -p 8080:8080 weather-outlook

# Push to registry
docker tag weather-outlook your-registry/weather-outlook
docker push your-registry/weather-outlook
```

### Deploy to services:
- **Docker Hub**: Free public/private repositories
- **AWS ECR**: Amazon Elastic Container Registry
- **Google Container Registry**: GCP integration
- **Azure Container Registry**: Microsoft integration

## Server Deployment (Linux/Apache/Nginx)

### Apache

1. **Copy files to web root**
   ```bash
   sudo cp index.html /var/www/html/
   ```

2. **.htaccess** (optional, for clean URLs)
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule ^ index.html [L]
   </IfModule>
   ```

3. **Enable HTTPS** (Let's Encrypt)
   ```bash
   sudo apt install certbot python3-certbot-apache
   sudo certbot --apache -d yourdomain.com
   ```

### Nginx

1. **Copy files**
   ```bash
   sudo cp index.html /var/www/html/
   ```

2. **Configure** (/etc/nginx/sites-available/default)
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     
     root /var/www/html;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. **Enable HTTPS**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Comparison Table

| Platform | Cost | Setup | Performance | Maintenance |
|----------|------|-------|-------------|-------------|
| GitHub Pages | Free | 5 min | Excellent | None |
| Netlify | Free+ | 5 min | Excellent | None |
| Vercel | Free+ | 5 min | Excellent | None |
| Firebase | Free+ | 5 min | Good | Minimal |
| AWS S3+CF | $0.50-1/mo | 15 min | Excellent | Minimal |
| Azure | Free+ | 10 min | Good | None |
| VPS | $5-20/mo | 30 min | Good | Moderate |

## Best Practices

### Performance
- ✅ Enable compression
- ✅ Use CDN (all recommended platforms include)
- ✅ Cache static assets
- ✅ Minify CSS/JS (optional for small files)

### Security
- ✅ Enable HTTPS (all recommended)
- ✅ Add Security headers
- ✅ Regular updates
- ✅ Monitor uptime

### Monitoring
- ✅ Set up alerts
- ✅ Monitor response times
- ✅ Track error rates
- ✅ User analytics

### Updates
```bash
# Pull latest changes from GitHub
git pull origin main

# Deploy (platform-specific)
# GitHub Pages: Auto-deploys
# Netlify/Vercel: Auto-deploys
# S3: aws s3 sync . s3://bucket-name/
# Docker: docker build and push
```

## Recommendation

**For most users: GitHub Pages**
- Free, simple, reliable
- No configuration needed
- Automatic HTTPS
- Perfect for open-source projects

**For production: Netlify or Vercel**
- More features
- Better analytics
- Easy custom domains
- Faster deployments

**For high-volume: AWS + CloudFront**
- Global distribution
- Advanced caching
- Pay-as-you-go pricing
- Enterprise-ready

## Support

- Documentation: See README.md
- Issues: GitHub Issues
- Questions: GitHub Discussions

---

*Last updated: May 2026*
