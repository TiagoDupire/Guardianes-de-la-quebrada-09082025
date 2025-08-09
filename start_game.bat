@echo off
echo 🌿 Iniciando Guardianes de las Plantas del Peru...

REM Verificar si MongoDB está corriendo
echo Verificando MongoDB...
tasklist /fi "imagename eq mongod.exe" 2>NUL | find /i "mongod.exe" >NUL
if "%ERRORLEVEL%" == "0" (
    echo ✅ MongoDB está corriendo
) else (
    echo ❌ MongoDB no está corriendo. Iniciando...
    net start MongoDB
    timeout /t 3 >NUL
)

REM Verificar Node.js
where node >NUL 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js no está instalado
    pause
    exit /b 1
)

REM Verificar Python
where python >NUL 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Python no está instalado
    pause
    exit /b 1
)

REM Instalar dependencias del backend si es necesario
if not exist "backend\venv" (
    echo Configurando entorno virtual del backend...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
)

REM Instalar dependencias del frontend si es necesario
if not exist "frontend\node_modules" (
    echo Instalando dependencias del frontend...
    cd frontend
    npm install
    cd ..
)

echo 🚀 Iniciando servicios...

REM Iniciar backend
echo Iniciando backend en http://localhost:8001
cd backend
call venv\Scripts\activate
start /b python server.py
cd ..

REM Esperar un poco para que el backend inicie
timeout /t 3 >NUL

REM Iniciar frontend
echo Iniciando frontend en http://localhost:3000
cd frontend
start npm start
cd ..

echo ✅ ¡Juego iniciado exitosamente!
echo 📱 Abre tu navegador en: http://localhost:3000
echo Presiona cualquier tecla para detener el juego
pause >NUL