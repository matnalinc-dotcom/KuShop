@echo off
echo ======================================================================
echo    KuShop - Cloudflare Online Tunnel
echo ======================================================================
echo.
echo * Note: Please keep Backend (port 3000) and Frontend (port 5173) running!
echo * Generating online HTTPS link...
echo.
cloudflared.exe tunnel --url http://localhost:5173
pause
