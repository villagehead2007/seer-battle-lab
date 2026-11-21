@echo off
setlocal
cd /d "%~dp0"
set "NODE_PATH="
set "NODE_OPTIONS="
set "WIKI_POWERSHELL=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
"runtime\node.exe" --no-global-search-paths start.cjs %*
if errorlevel 1 pause
