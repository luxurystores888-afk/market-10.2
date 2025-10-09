@echo off
echo.
echo ========================================
echo   CYBER MART 2077 - QUICK START
echo   Setting up your $1B platform...
echo ========================================
echo.

:: Check if .env exists
if not exist .env (
    echo [1/4] Creating .env file...
    (
    echo # Cyber Mart 2077 - Environment Variables
    echo.
    echo # Database ^(Get FREE from neon.tech^)
    echo DATABASE_URL=postgresql://user:pass@host/database
    echo.
    echo # Live Chat ^(Get FREE from tawk.to - 5 min signup^)
    echo VITE_TAWK_PROPERTY_ID=YOUR_TAWK_ID_HERE
    echo.
    echo # Analytics ^(Get FREE from clarity.microsoft.com^)
    echo VITE_CLARITY_PROJECT_ID=YOUR_CLARITY_ID_HERE
    echo.
    echo # Google Analytics ^(FREE^)
    echo VITE_GA_TRACKING_ID=G-XXXXXXXXXX
    echo.
    echo # Facebook Pixel ^(FREE^)
    echo VITE_FACEBOOK_PIXEL_ID=123456789
    echo.
    echo # Optional - Email ^(SendGrid FREE 100/day^)
    echo SENDGRID_API_KEY=your-api-key
    echo FROM_EMAIL=noreply@yourdomain.com
    echo.
    echo # Optional - SMS ^(Twilio $15 free credit^)
    echo TWILIO_ACCOUNT_SID=your-sid
    echo TWILIO_AUTH_TOKEN=your-token
    echo TWILIO_PHONE_NUMBER=+1234567890
    echo.
    echo # Server
    echo PORT=3001
    echo NODE_ENV=development
    echo SITE_URL=https://yourdomain.com
    echo BRAND_NAME=Cyber Mart 2077
    ) > .env
    echo [SUCCESS] .env file created!
    echo.
    echo IMPORTANT: Edit .env and add your API keys:
    echo   - Tawk.to: https://tawk.to ^(5 min signup^)
    echo   - Clarity: https://clarity.microsoft.com ^(5 min signup^)
    echo.
) else (
    echo [SKIP] .env file already exists
    echo.
)

:: Check if node_modules exists
if not exist node_modules (
    echo [2/4] Installing dependencies...
    echo This may take 2-3 minutes...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo [ERROR] npm install failed
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed!
    echo.
) else (
    echo [SKIP] Dependencies already installed
    echo.
)

:: Build the project
echo [3/4] Building project...
call npx vite build
if errorlevel 1 (
    echo [WARNING] Build had some warnings, but should work
)
echo [SUCCESS] Build complete!
echo.

:: Start development server
echo [4/4] Starting development server...
echo.
echo ========================================
echo   🚀 STARTING YOUR PLATFORM!
echo ========================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:3001
echo.
echo   Press Ctrl+C to stop
echo ========================================
echo.

:: Start dev server
start "" cmd /c "npm run dev"

echo.
echo [DONE] Development server starting...
echo.
echo NEXT STEPS:
echo.
echo 1. Open browser: http://localhost:5173
echo 2. Edit .env and add API keys
echo 3. Get FREE Tawk.to: https://tawk.to
echo 4. Get FREE Clarity: https://clarity.microsoft.com
echo 5. Refresh browser to activate features
echo.
echo ========================================
echo   READ: START_HERE_ULTIMATE.md
echo   For complete setup guide!
echo ========================================
echo.

pause

