@echo off
echo.
echo ======================================
echo    Creating ZIP of AI Platform
echo ======================================
echo.

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File CREATE_ZIP.ps1

pause
