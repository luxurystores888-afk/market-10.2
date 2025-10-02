@echo off
echo Starting full automation...

cd /d "%~dp0"

net start postgresql-x64-16

npm install

:db_retry
npm run db:push
if errorlevel 1 (
  echo DB setup failed - retrying in 5s...
  timeout /t 5
  goto db_retry
)

npm run dev:all

docker-compose up -d

timeout /t 10  // Wait for server

npm run automation:start

echo Automation complete! Platform is running autonomously.
pause
