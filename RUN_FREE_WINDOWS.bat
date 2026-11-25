@echo off
title Shubh AI Voice Studio
if not exist .venv\Scripts\python.exe (
  echo First run START_FREE_WINDOWS.bat and complete setup.
  pause
  exit /b 1
)
call .venv\Scripts\activate
python local_app.py
pause
