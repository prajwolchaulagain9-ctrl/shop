# Gautam Lady Shoes - Quick Start & Deployment Guide

## 🚀 Quick Start (Development)

### Step 1: Prerequisites
- Node.js 18 or higher installed ([download](https://nodejs.org/))
- Terminal/Command Prompt
- Code editor (VS Code recommended)

### Step 2: Install Dependencies
```bash
cd gautam-nextjs
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

### Step 4: View Pages
- Home: http://localhost:3000
- Slippers: http://localhost:3000/slippers
- Clothing: http://localhost:3000/clothing
- Collections: http://localhost:3000/collections
- Team: http://localhost:3000/team

## 📦 Building for Production

```bash
npm run build
npm run start
```

This creates an optimized production build in the `.next` folder.

## ☁️ Deploy to Vercel (Easiest)

Vercel is the official Next.js hosting platform - deployment takes 2 minutes:

### Option 1: From GitHub
1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Deploy"

### Option 2: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and your site will be deployed!

## 🐳 Deploy with Docker

### Step 1: Create `Dockerfile`
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Build and Run
```bash
docker build -t gautam-lady-shoes .
docker run -p 3000:3000 gautam-lady-shoes
```

## 🔄 Deploy to Other Platforms

### Netlify
```bash
npm run build
# Deploy the .next folder to Netlify
```

### AWS Amplify
1. Connect GitHub repository to AWS Amplify
2. Select "Next.js" build preset
3. Deploy

### Self-Hosted (VPS/Dedicated Server)

#### Linux/Ubuntu Setup:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <your-repo-url>
cd gautam-nextjs
npm install
npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start npm --name "gautam-shop" -- start
pm2 startup
pm2 save
```

#### With Nginx Reverse Proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔐 Setting Up SSL Certificate

### With Let's Encrypt (Free)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Update Nginx for HTTPS
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        # ... rest of config
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 Environment Variables (Optional)

Create `.env.local` file:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🔍 Monitoring & Maintenance

### Health Check
```bash
# Check if application is running
curl http://localhost:3000
```

### View Logs (PM2)
```bash
pm2 logs gautam-shop
```

### Restart Application
```bash
pm2 restart gautam-shop
```

### Monitor Performance
```bash
pm2 monit
```

## 📈 Analytics Setup

### Add Google Analytics
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create new property for your domain
3. Get your Measurement ID
4. Add to `app/layout.tsx`:

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## 🛠️ Troubleshooting Deployment

### "Port 3000 is already in use"
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### "Module not found" errors
```bash
# Rebuild dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### "Out of memory" during build
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=2048 npm run build
```

## ✅ Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test locally with `npm run dev`
- [ ] Check all pages load correctly
- [ ] Verify images display properly
- [ ] Test responsive design on mobile
- [ ] Ensure no console errors
- [ ] Update meta descriptions
- [ ] Configure domain name
- [ ] Set up SSL certificate
- [ ] Test contact/call links work
- [ ] Monitor first 24 hours

## 📞 Support

For issues or questions:
1. Check the logs: `pm2 logs gautam-shop`
2. Review Next.js docs: [nextjs.org](https://nextjs.org)
3. Check Vercel docs: [vercel.com/docs](https://vercel.com/docs)

## 🎯 Next Steps

After deployment:
1. Share URL with stakeholders
2. Monitor analytics
3. Gather feedback
4. Plan for e-commerce features (if needed)
5. Set up contact form backend
6. Implement product admin dashboard (optional)

---

**Deployment Status**: Ready for production ✓
**Framework**: Next.js 16.1.6
**Last Updated**: February 2025
