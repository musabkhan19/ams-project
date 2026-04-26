@echo off
echo Starting AMS Airline Management System...
cd /d C:\Users\DELL\Downloads\ams-project\ams-project
start "AMS Backend" cmd /k "node server.js"
timeout /t 3
start "AMS Frontend" cmd /k "live-server"
echo Done! Check your browser at http://127.0.0.1:8080
