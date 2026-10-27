@echo off
chcp 65001 >nul
echo ===================================================
echo    เปิดใช้งาน Backend KuShop (พอร์ต 3000)
echo ===================================================
cd BackEnd\jwt
node index.js
pause
