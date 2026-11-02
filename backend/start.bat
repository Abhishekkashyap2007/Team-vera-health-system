@echo off
echo Starting VeraHealth FastAPI Production Backend on port 8000...
cd /d "%~dp0"
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
