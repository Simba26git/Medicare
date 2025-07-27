# 🚀 Netlify Deployment Guide for MedCare

## Prerequisites
- GitHub account
- Netlify account
- Backend deployed (Heroku, Railway, or similar)

## Step 1: Prepare Your Repository

1. **Initialize Git Repository** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - MedCare medical platform"
```

2. **Create GitHub Repository**:
- Go to GitHub and create a new repository named "medcare-platform"
- Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/medcare-platform.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend First

### Option A: Deploy to Heroku
1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create Heroku app: `heroku create medcare-backend`
4. Deploy backend:
```bash
cd backend
git subtree push --prefix backend heroku main
```

### Option B: Deploy to Railway
1. Go to railway.app
2. Connect your GitHub repository
3. Select the backend folder
4. Deploy with one click

### Option C: Deploy to Render
1. Go to render.com
2. Connect your GitHub repository
3. Create a new Web Service
4. Set build command: `cd backend && npm install && npm run build`
5. Set start command: `cd backend && npm start`

## Step 3: Deploy Frontend to Netlify

### Automatic Deployment (Recommended)

1. **Go to Netlify Dashboard**:
   - Visit https://app.netlify.com
   - Click "New site from Git"

2. **Connect Repository**:
   - Choose GitHub
   - Select your repository
   - Choose main branch

3. **Configure Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/out`

4. **Set Environment Variables**:
   - Go to Site settings > Environment variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.herokuapp.com/api`

5. **Deploy**:
   - Click "Deploy site"
   - Wait for deployment to complete

### Manual Deployment

1. **Build the project locally**:
```bash
cd frontend
npm install
npm run build
```

2. **Deploy to Netlify**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=out
```

## Step 4: Update Environment Variables

After deployment, update the environment variables in Netlify:

1. Go to your Netlify site dashboard
2. Navigate to "Site settings" > "Environment variables"
3. Add the following variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com/api
NEXT_PUBLIC_APP_NAME=MedCare
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production
```

## Step 5: Configure Domain (Optional)

1. **Custom Domain**:
   - Go to Site settings > Domain management
   - Add custom domain
   - Configure DNS records

2. **SSL Certificate**:
   - Netlify provides automatic HTTPS
   - Certificate will be provisioned automatically

## Step 6: Set Up Continuous Deployment

1. **Automatic Deployments**:
   - Every push to main branch will trigger deployment
   - Preview deployments for pull requests

2. **Build Notifications**:
   - Configure Slack/email notifications
   - Set up deployment status badges

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version (use Node 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **API Connection Issues**:
   - Verify CORS settings on backend
   - Check environment variables
   - Ensure HTTPS for production API

3. **Routing Issues**:
   - Check `netlify.toml` redirects
   - Verify static export configuration

### Build Commands:
```bash
# Frontend build
cd frontend && npm install && npm run build

# If build fails, try:
cd frontend && npm install --legacy-peer-deps && npm run build
```

## Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Environment variables configured
- [ ] Frontend builds successfully
- [ ] API connections working
- [ ] Authentication flow working
- [ ] All features tested in production
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring set up

## Production URLs

After deployment, you'll have:
- **Frontend**: https://your-site-name.netlify.app
- **Backend**: https://your-backend-url.herokuapp.com
- **Admin Panel**: https://your-site-name.netlify.app/login

## Support

If you encounter issues:
1. Check Netlify deploy logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors

Your MedCare platform is now ready for production! 🎉
