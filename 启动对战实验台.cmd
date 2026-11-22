@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0" || exit /b 1
if exist "C:\Program Files\nodejs\node.exe" (
  "C:\Program Files\nodejs\node.exe" "%~dp0start.cjs" %*
) else (
  node "%~dp0start.cjs" %*
)
set "seer_exit=%errorlevel%"
if not "%seer_exit%"=="0" pause
exit /b %seer_exit%
