@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo 未检测到 Node.js。请先安装 Node.js，或直接打开已经生成的 dist\index.html。
  pause
  exit /b 1
)
start "RoseTools Local Server" cmd /k "cd /d ""%~dp0"" && npm.cmd run dev"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173/"
endlocal
