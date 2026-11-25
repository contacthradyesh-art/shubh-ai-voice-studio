@echo off
title Shubh AI Voice Studio - Free Local Setup
echo ==========================================
echo   SHUBH AI VOICE STUDIO - FREE LOCAL
echo ==========================================
where py >nul 2>nul
if errorlevel 1 (
  echo Python launcher not found. Install Python 3.10 x64 first.
  pause
  exit /b 1
)
py -3.10 --version
if errorlevel 1 (
  echo Python 3.10 is required. Install it from python.org and try again.
  pause
  exit /b 1
)
if not exist .venv (
  py -3.10 -m venv .venv
)
call .venv\Scripts\activate
python -m pip install --upgrade pip
echo Installing CPU-only PyTorch. This can take a while...
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements-local.txt
pip install git+https://github.com/ai4bharat/IndicF5.git
echo.
echo IMPORTANT: Open https://huggingface.co/ai4bharat/IndicF5, sign in and accept the model conditions.
echo Then run: hf auth login
echo.
echo After accepting conditions and logging in, launch this file again or run:
echo .venv\Scripts\python local_app.py
pause
