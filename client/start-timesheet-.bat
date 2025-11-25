@echo off
echo Starting backend servers...

REM Start Node.js backend
cd D:\servers\timesheet-management\t\tback
start cmd /k "npm start"

echo All servers started successfully.
pause
