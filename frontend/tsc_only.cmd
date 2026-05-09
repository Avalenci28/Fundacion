@echo off
cd /d "c:\Users\andre\OneDrive\Documentos\WEB FUNDACION\frontend"
npx tsc --noEmit --pretty false > tsc_output.txt
exit /b %errorlevel%

