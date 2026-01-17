@echo off
echo ===============================================
echo  Gandharva Trekking Platform - Start All
echo ===============================================
echo.
echo This will start all three services:
echo   1. Backend API (Port 5000)
echo   2. Frontend Website (Port 3000)
echo   3. Admin Dashboard (Port 3001)
echo.
echo Press Ctrl+C in each window to stop
echo ===============================================
echo.

echo Starting Backend API...
start cmd /k "cd backend && npm start"
timeout /t 2 /nobreak >nul

echo Starting Frontend Website...
start cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo Starting Admin Dashboard...
start cmd /k "cd admin && npm run dev"

echo.
echo ===============================================
echo All services are starting!
echo ===============================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin:    http://localhost:3001
echo ===============================================
