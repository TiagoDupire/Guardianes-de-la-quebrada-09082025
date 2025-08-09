#!/bin/bash

echo "🌿 Iniciando Guardianes de las Plantas del Perú..."

# Colores para mejor output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si MongoDB está corriendo
echo -e "${YELLOW}Verificando MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✅ MongoDB está corriendo${NC}"
else
    echo -e "${RED}❌ MongoDB no está corriendo. Iniciando...${NC}"
    # Intentar iniciar MongoDB
    if command -v brew &> /dev/null; then
        # macOS con Homebrew
        brew services start mongodb-community
    elif command -v systemctl &> /dev/null; then
        # Linux con systemctl
        sudo systemctl start mongod
    else
        echo -e "${RED}Por favor inicia MongoDB manualmente${NC}"
        exit 1
    fi
    sleep 3
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${RED}❌ Python no está instalado${NC}"
    exit 1
fi

# Función para manejar la salida limpia
cleanup() {
    echo -e "\n${YELLOW}Deteniendo servicios...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar señales para cleanup
trap cleanup SIGINT SIGTERM

# Instalar dependencias del backend si es necesario
if [ ! -d "backend/venv" ]; then
    echo -e "${YELLOW}Configurando entorno virtual del backend...${NC}"
    cd backend
    python3 -m venv venv || python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Instalar dependencias del frontend si es necesario
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Instalando dependencias del frontend...${NC}"
    cd frontend
    npm install
    cd ..
fi

echo -e "${GREEN}🚀 Iniciando servicios...${NC}"

# Iniciar backend
echo -e "${YELLOW}Iniciando backend en http://localhost:8001${NC}"
cd backend
source venv/bin/activate
python server.py &
BACKEND_PID=$!
cd ..

# Esperar un poco para que el backend inicie
sleep 3

# Iniciar frontend
echo -e "${YELLOW}Iniciando frontend en http://localhost:3000${NC}"
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}✅ ¡Juego iniciado exitosamente!${NC}"
echo -e "${GREEN}📱 Abre tu navegador en: http://localhost:3000${NC}"
echo -e "${YELLOW}Presiona Ctrl+C para detener el juego${NC}"

# Esperar a que termine
wait