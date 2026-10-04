@echo off
chcp 65001 >nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Check-BluetoothAudioLeak.ps1" -ReportPath "%~dp0audio-check-report.txt"
echo.
pause
