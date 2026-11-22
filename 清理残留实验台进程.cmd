@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0" || exit /b 1
if exist "C:\Program Files\nodejs\node.exe" (
  "C:\Program Files\nodejs\node.exe" "%~dp0cleanup-launchers.cjs" %*
) else (
  node "%~dp0cleanup-launchers.cjs" %*
)
set "seer_exit=%errorlevel%"
if /i not "%~1"=="--auto" pause
exit /b %seer_exit%
