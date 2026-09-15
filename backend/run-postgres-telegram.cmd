@echo off
setlocal

set "TELEGRAM_ENABLED=true"

if "%TELEGRAM_CHAT_ID%"=="" (
  set /p TELEGRAM_CHAT_ID=Telegram chat id:
)

if "%TELEGRAM_BOT_TOKEN%"=="" (
  set /p TELEGRAM_BOT_TOKEN=Telegram bot token:
)

call run-postgres.cmd
