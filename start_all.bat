@echo off
echo ========================================================
echo Starting VeraHealth Clinical AI Platform
echo ========================================================
echo.
echo 1. Starting FastAPI Backend on http://localhost:8000 ...
start "VeraHealth Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo 2. Starting Vite Frontend on http://localhost:5173 ...
start "VeraHealth Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Platform launched! Visit http://localhost:5173 in your browser.
echo ========================================================
pause

