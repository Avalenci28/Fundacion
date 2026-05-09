@echo off
cd /d "%~dp0"
npx tsc --noEmit
exit /b %errorlevel%

