@echo off
cd /d "%~dp0"

echo Starting SolveSnap backend and frontend...
echo.

echo Freeing port 5000 if in use...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do taskkill /PID %%a /F 2>nul
timeout /t 1 /nobreak >nul

start "SolveSnap Server" cmd /k "cd server && node index.js"
timeout /t 2 /nobreak >nul

start "SolveSnap Client" cmd /k "cd client && npm run dev"

echo.
echo Backend and frontend started in separate windows.
echo Close those windows to stop the servers.
echo.
echo If you see "address already in use :5000", close the old Server window first.
pause
