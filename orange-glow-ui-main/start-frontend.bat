@echo off
title Frontend Server - Klinik Sentosa
cd /d "%~dp0"
echo ========================================
echo   FRONTEND SERVER - KLINIK SENTOSA
echo ========================================
echo.
echo Memulai frontend development server...
echo.
call npm run dev
echo.
echo Frontend server stopped!
pause
