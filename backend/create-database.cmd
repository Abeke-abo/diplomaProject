@echo off
setlocal

set "PSQL=C:\Program Files\PostgreSQL\18\bin\psql.exe"
set "DB_HOST=localhost"
set "DB_PORT=5432"
set "DB_USERNAME=postgres"
set "DB_NAME=remotep"

if not exist "%PSQL%" (
  echo psql.exe not found: %PSQL%
  exit /b 1
)

if "%DB_PASSWORD%"=="" (
  set /p DB_PASSWORD=PostgreSQL password for user postgres:
)

set "PGPASSWORD=%DB_PASSWORD%"
"%PSQL%" -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d postgres -lqt | findstr /R /C:"^[ ]*%DB_NAME%[ ]*|" >nul

if not errorlevel 1 (
  echo Database %DB_NAME% already exists.
) else (
  echo Creating database %DB_NAME%...
  "%PSQL%" -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d postgres -c "CREATE DATABASE %DB_NAME%;"
  if errorlevel 1 exit /b 1
)

echo Done.
