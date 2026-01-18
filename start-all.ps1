# Start all Orophiletrek services
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " Orophiletrek - Start All" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting all three services:" -ForegroundColor Yellow
Write-Host "  1. Backend API (Port 5000)" -ForegroundColor White
Write-Host "  2. Frontend Website (Port 3000)" -ForegroundColor White
Write-Host "  3. Admin Dashboard (Port 3001)" -ForegroundColor White
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "[1/3] Starting Backend API..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[2/3] Starting Frontend Website..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"
Start-Sleep -Seconds 2

# Start Admin
Write-Host "[3/3] Starting Admin Dashboard..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\admin'; npm run dev"

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " All services are starting!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Yellow
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Admin:    http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
