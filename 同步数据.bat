@echo off
chcp 65001 >nul
cd /d "%~dp0"
call npm.cmd run build
if errorlevel 1 (
  echo.
  echo 数据构建失败，请检查上方错误。
  pause
  exit /b 1
)
echo.
echo 构建完成，部署文件位于 dist 目录。
pause
