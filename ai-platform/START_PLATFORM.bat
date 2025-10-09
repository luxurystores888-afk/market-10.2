@echo off
echo.
echo ========================================
echo     AI PLATFORM QUICK START
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 20+ from https://nodejs.org
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Docker is not running!
    echo The platform will work but some features may be limited.
    echo.
)

REM Create necessary directories
if not exist "uploads" mkdir uploads
if not exist "logs" mkdir logs

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env >nul
    echo.
    echo IMPORTANT: Please edit .env file with your API keys!
    echo.
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo ========================================
echo     STARTING AI PLATFORM
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo Admin:    http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the servers
echo ========================================
echo.

REM Start the development servers
call npm run dev

pause
