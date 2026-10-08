@echo off
title Planet G - Sync Header and Footer
color 0A
echo ========================================================
echo  Planet G - Syncing Partials (Header & Footer)
echo ========================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync-components.ps1"
echo.
echo ========================================================
echo  Sync completed! Press any key to exit.
echo ========================================================
pause >nul
