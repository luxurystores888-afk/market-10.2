@echo off
cls
echo.
echo ==================================================
echo    CREATING ZIP FILE OF ALL YOUR WORK
echo ==================================================
echo.
echo This will create a ZIP file containing:
echo.
echo  - AI Platform (Full-stack application)
echo  - CYBER MART 2077 (E-commerce system) 
echo  - All documentation
echo  - All configurations
echo  - Everything we worked on!
echo.
echo ==================================================
REM pause

REM Run the PowerShell script with elevated permissions
powershell -ExecutionPolicy Bypass -File "%~dp0CREATE_COMPLETE_ZIP.ps1"

echo.
pause
