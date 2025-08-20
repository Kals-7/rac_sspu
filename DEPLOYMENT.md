# 🚀 Deployment Guide - Rotaract Club of SSPU

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- Domain name (optional but recommended)

## 🎯 Deployment Options

### Option 1: Railway (Recommended - Full Backend Support)
**Cost**: $5/month starting
**Best for**: Full functionality with BOD login and membership forms

#### Steps:
1. **Sign up** at [railway.app](https://railway.app)
2. **Connect** your GitHub repository
3. **Deploy** - Railway will auto-detect Node.js
4. **Set environment variables**:
   ```
   JWT_SECRET=your-super-secret-key-here
   NODE_ENV=production
   PORT=3000
   ```
5. **Get your URL**: `https://your-app-name.railway.app`

### Option 2: Render (Alternative - Full Backend)
**Cost**: Free tier + $7/month for backend
**Best for**: Full functionality with auto-deploy

#### Steps:
1. **Sign up** at [render.com](https://render.com)
2. **Create new Web Service**
3. **Connect** your GitHub repository
4. **Configure**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Same as Railway
5. **Deploy** and get your URL

### Option 3: Netlify (Static Only - No Backend)
**Cost**: Free
**Best for**: Static site without login functionality

#### Steps:
1. **Sign up** at [netlify.com](https://netlify.com)
2. **Connect** your GitHub repository
3. **Build settings**:
   - **Build command**: Leave empty
   - **Publish directory**: `.` (root)
4. **Deploy** - but note: BOD login won't work

## 🔧 Environment Setup

### 1. Create `.env` file in root:
```bash
# Copy from env.example
cp env.example .env
```

### 2. Edit `.env` with your values:
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=https://yourdomain.com
DB_PATH=./data/rac.db
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Install dependencies:
```bash
npm install
```

## 🚀 Local Testing Before Deployment

### 1. Test locally:
```bash
npm start
```

### 2. Visit: `http://localhost:3000`

### 3. Test BOD login with:
- **Username**: `admin`
- **Password**: `password`

## 🌐 Domain & SSL Setup

### Railway/Render:
- **Automatic SSL**: ✅ Included
- **Custom Domain**: ✅ Supported
- **Setup**: Add domain in dashboard

### Netlify:
- **Automatic SSL**: ✅ Included
- **Custom Domain**: ✅ Supported
- **Setup**: Add domain in dashboard

## 📱 Post-Deployment Checklist

- [ ] Test BOD login functionality
- [ ] Test membership form submission
- [ ] Verify gallery images load
- [ ] Check mobile responsiveness
- [ ] Test all navigation links
- [ ] Verify contact information
- [ ] Test social media links

## 🆘 Troubleshooting

### Common Issues:

1. **"Cannot find module" errors**
   - Ensure `npm install` ran successfully
   - Check `package.json` dependencies

2. **BOD login not working**
   - Verify environment variables are set
   - Check server logs for errors

3. **Images not loading**
   - Ensure `assets/gallery/` folder is included
   - Check file permissions

4. **Database errors**
   - Ensure data directory is writable
   - Check database file permissions

## 📞 Support

- **GitHub Issues**: Create issue in repository
- **Documentation**: Check this file and README.md
- **Platform Support**: Use platform-specific support channels

## 🔒 Security Notes

- **Change JWT_SECRET** in production
- **Use HTTPS** (automatic on most platforms)
- **Regular updates** for dependencies
- **Monitor logs** for suspicious activity

---

**Happy Deploying! 🎉**
Your Rotaract Club website will be live soon!

