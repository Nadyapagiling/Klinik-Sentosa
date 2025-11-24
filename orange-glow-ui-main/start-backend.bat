@echo off
title Backend Server - Klinik Sentosa
cd /d "%~dp0server"
echo ========================================
echo   BACKEND SERVER - KLINIK SENTOSA
echo ========================================
echo.
echo Memulai server backend...
echo Port: 3001
echo Database: MongoDB Atlas
echo.
call npm start
echo.
echo Backend server stopped!
pause
