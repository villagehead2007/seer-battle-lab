@echo off
cd /d "%~dp0"
if exist "C:\Program Files\nodejs\node.exe" (
  "C:\Program Files\nodejs\node.exe" start.cjs
) else (
  node start.cjs
)
if errorlevel 1 pause
