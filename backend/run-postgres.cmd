@echo off
setlocal

set "DB_URL=jdbc:postgresql://localhost:5432/remotep"
set "DB_USERNAME=postgres"
set "SEED_ADMIN_ENABLED=true"

if "%ADMIN_EMAIL%"=="" (
  set /p ADMIN_EMAIL=Admin email:
)

if "%ADMIN_PASSWORD%"=="" (
  set /p ADMIN_PASSWORD=Admin password:
)

if "%ADMIN_NAME%"=="" (
  set "ADMIN_NAME=RemoteP Admin"
)

if "%DB_PASSWORD%"=="" (
  set /p DB_PASSWORD=PostgreSQL password for user postgres:
)

if "%JWT_SECRET%"=="" (
  set /p JWT_SECRET=JWT secret:
)

if "%TELEGRAM_ENABLED%"=="" (
  set "TELEGRAM_ENABLED=false"
)

if /I "%TELEGRAM_ENABLED%"=="true" (
  if "%TELEGRAM_BOT_TOKEN%"=="" set /p TELEGRAM_BOT_TOKEN=Telegram bot token:
  if "%TELEGRAM_CHAT_ID%"=="" set /p TELEGRAM_CHAT_ID=Telegram chat id:
)

set "JAVA_EXE=C:\Users\Asus\.jdks\openjdk-23.0.2\bin\java.exe"
if not exist "%JAVA_EXE%" (
  set "JAVA_EXE=java"
)

if not exist "target\backend-0.0.1-SNAPSHOT.jar" (
  echo Backend jar not found. Building it first...
  ..\tools\apache-maven-3.9.11\bin\mvn.cmd -DskipTests package
  if errorlevel 1 exit /b 1
)

"%JAVA_EXE%" -jar target\backend-0.0.1-SNAPSHOT.jar ^
  --spring.profiles.active=postgres ^
  --spring.datasource.url=%DB_URL% ^
  --spring.datasource.username=%DB_USERNAME% ^
  --spring.datasource.password=%DB_PASSWORD% ^
  --app.jwt.secret=%JWT_SECRET% ^
  --app.seed-admin.enabled=%SEED_ADMIN_ENABLED% ^
  --app.seed-admin.email=%ADMIN_EMAIL% ^
  --app.seed-admin.password=%ADMIN_PASSWORD% ^
  "--app.seed-admin.name=%ADMIN_NAME%" ^
  --app.telegram.enabled=%TELEGRAM_ENABLED% ^
  --app.telegram.bot-token=%TELEGRAM_BOT_TOKEN% ^
  --app.telegram.chat-id=%TELEGRAM_CHAT_ID%
