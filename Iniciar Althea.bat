@echo off
title Althea - servidor de desenvolvimento
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo O Node.js nao foi encontrado. Instale em https://nodejs.org e tente de novo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Primeira execucao: instalando dependencias, isso pode levar alguns minutos...
  call npm install
  if errorlevel 1 (
    echo Falha ao instalar as dependencias.
    pause
    exit /b 1
  )
)

echo.
echo Iniciando o Althea. O navegador abre sozinho quando estiver pronto.
echo Para encerrar, feche esta janela ou pressione Ctrl+C.
echo.
call npm run dev -- --open
pause
