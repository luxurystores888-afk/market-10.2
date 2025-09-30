@echo off
echo 🚀 CYBER MART 2077 - DEVELOPMENT STARTUP
echo ========================================

echo.
echo 📋 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

echo.
echo 📦 Installing dependencies...
npm install

echo.
echo 🗄️ Setting up database...
npm run db:push

echo.
echo 🔨 Building application...
npm run build

echo.
echo 🚀 STARTING DEVELOPMENT SERVERS...
echo.
echo Opening Frontend: http://localhost:5000
echo Opening Backend: http://localhost:3001
echo.

start "Backend Server" cmd /k "npm run dev:server"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 🎉 CYBER MART 2077 is starting up!
echo Check the opened terminal windows for server status.
echo.
pause
