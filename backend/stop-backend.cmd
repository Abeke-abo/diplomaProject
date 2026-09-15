@echo off
setlocal

set "BACKEND_PID="

for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
  set "BACKEND_PID=%%p"
)

if "%BACKEND_PID%"=="" (
  echo Backend is not running on port 5000.
  exit /b 0
)

echo Stopping backend on port 5000. PID: %BACKEND_PID%
taskkill /PID %BACKEND_PID% /F
