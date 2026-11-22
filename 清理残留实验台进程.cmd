@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0" || exit /b 1
set "NODE_PATH="
set "NODE_OPTIONS=--no-global-search-paths"
set "WIKI_POWERSHELL=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
"%~dp0runtime\node.exe" "%~dp0cleanup-launchers.cjs" %*
set "seer_exit=%errorlevel%"
if /i not "%~1"=="--auto" pause
exit /b %seer_exit%
