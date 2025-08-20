@echo off
chcp 65001 >nul
echo 🚀 Preparing Rotaract Club SSPU for deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 18 (
    echo ❌ Node.js version 18+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version detected:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo 🔧 Creating .env file from template...
    copy env.example .env
    echo ⚠️  IMPORTANT: Please edit .env file with your production values!
    echo    - Change JWT_SECRET to a secure random string
    echo    - Update CORS_ORIGIN to your domain
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Your project is ready for deployment!
echo.
echo 📋 Next steps:
echo 1. Push your code to GitHub
echo 2. Choose a deployment platform:
echo    - Railway (recommended): https://railway.app
echo    - Render: https://render.com
echo    - Netlify (static only): https://netlify.com
echo.
echo 📖 See DEPLOYMENT.md for detailed instructions
echo.
echo 🚀 Happy deploying!
echo.
pause

