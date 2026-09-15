@echo off
setlocal

call stop-backend.cmd
timeout /t 2 /nobreak >nul
call run-postgres.cmd
