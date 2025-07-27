@echo off
REM MedCare Vercel Deployment Script for Windows
REM This script prepares and deploys your medical platform to Vercel

echo 🚀 MedCare Vercel Deployment Script
echo ===================================

REM Check if we're in the correct directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the frontend directory.
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

echo 🔨 Building the application...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🌐 Ready for Vercel deployment!
    echo.
    echo Quick deployment options:
    echo.
    echo 1. GitHub Integration ^(Recommended^):
    echo    - Push to GitHub: git add . ^&^& git commit -m "Deploy" ^&^& git push
    echo    - Go to https://vercel.com/dashboard
    echo    - Click "New Project" and import your GitHub repo
    echo    - Set root directory to "frontend"
    echo    - Add environment variables in Vercel dashboard
    echo.
    echo 2. Vercel CLI:
    echo    - Install: npm install -g vercel
    echo    - Deploy: vercel
    echo.
    echo 3. Environment Variables to set in Vercel:
    echo    - NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com/api
    echo    - NEXT_PUBLIC_APP_NAME=MedCare
    echo    - NEXT_PUBLIC_ENVIRONMENT=production
    echo.
    echo 🎉 Your MedCare platform is ready for Vercel!
) else (
    echo ❌ Build failed. Please check the errors above.
    exit /b 1
)
