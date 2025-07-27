@echo off
REM MedCare Netlify Deployment Script for Windows
REM This script prepares and deploys your medical platform to Netlify

echo 🚀 MedCare Netlify Deployment Script
echo ====================================

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
    echo 📁 Build output is in the 'out' directory
    echo.
    echo Next steps for Netlify deployment:
    echo 1. Go to https://app.netlify.com
    echo 2. Click 'New site from Git' or drag the 'out' folder for manual deploy
    echo 3. Configure build settings:
    echo    - Base directory: frontend
    echo    - Build command: npm run build
    echo    - Publish directory: frontend/out
    echo 4. Set environment variables:
    echo    - NEXT_PUBLIC_API_URL: Your backend API URL
    echo.
    echo 🎉 Your MedCare platform is ready for deployment!
) else (
    echo ❌ Build failed. Please check the errors above.
    exit /b 1
)
