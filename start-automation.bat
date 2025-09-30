@echo off
echo 🚀 CYBER MART 2077 - AUTOMATION CONTROL
echo ========================================

echo.
echo 🤖 Starting INFINITE PROFIT MODE...
echo.

curl -X POST http://localhost:3001/api/automation/start

echo.
echo.
echo 📊 Checking automation status...
echo.

curl http://localhost:3001/api/automation/status

echo.
echo.
echo 🎯 Your automated revenue engines are now active!
echo.
echo 💰 FEATURES ACTIVATED:
echo   • AI Product Generation (every 2 hours)
echo   • Dynamic Pricing (every 5 minutes)  
echo   • Marketing Campaigns (every hour)
echo   • Smart Inventory (every 30 minutes)
echo   • Mega Profit Engine (continuous)
echo   • Viral Growth Engine (continuous)
echo.
echo 📈 Access your dashboard at: http://localhost:5000/automation
echo.
pause
