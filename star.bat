:: Comando executa o codigo e mantem o terminal aberto.
@echo off
cd "substitua pelo caminho da pasta do backend"
start cmd /k "node server.js"
start cmd /k "npm run lt"
exit

:: Comando executa o codigo em segundo plano.
@echo off
cd "substitua pelo caminho da pasta do backend"
start /B cmd /c "node server.js"
start /B cmd /c "npm run lt"
exit