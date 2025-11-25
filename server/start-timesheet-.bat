@echo off
echo Starting client servers...

REM Start React frontend
cd D:\servers\timesheet-management\t\tfront
start cmd /k "npm start"

echo All servers started successfully.
pause
