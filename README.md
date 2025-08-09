# 🌿 Guardianes de las Plantas del Perú

Un juego educativo interactivo sobre las plantas medicinales del Perú, con 5 niveles que enseñan sobre la conservación y el uso tradicional de nuestras plantas ancestrales.

## 🎮 Descripción del Juego

- **Nivel 1**: Guardianes de la Quebrada - Limpia el ecosistema de contaminantes
- **Nivel 2**: Guardián de la Muña - Cultiva la planta aromática en las alturas de Arequipa
- **Nivel 3**: Cuidando la Chachacoma - Cuida la planta medicinal andina
- **Nivel 4**: Kculli - Cultiva maíz morado del Valle del Colca
- **Nivel 5**: Maestro de Plantas - Quiz educativo sobre plantas del Perú

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19, React Router, Tailwind CSS
- **Backend**: FastAPI (Python)
- **Base de Datos**: MongoDB
- **Estado**: React Context API

## 📋 Requisitos Previos

### Para Windows:
- [Node.js 18+](https://nodejs.org/)
- [Python 3.9+](https://www.python.org/downloads/)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)

### Para macOS:
```bash
# Usando Homebrew
brew install node python mongodb-community git
```

### Para Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install nodejs npm python3 python3-pip mongodb git
```

## 🚀 Instalación y Configuración

### 1. Clonar o Descargar el Proyecto

```bash
# Opción 1: Si tienes Git
git clone https://github.com/tuusuario/guardianes-plantas-peru.git
cd guardianes-plantas-peru

# Opción 2: Descargar ZIP y extraer
```

### 2. Configurar MongoDB

#### Windows:
1. Instalar MongoDB Community Edition
2. Iniciar el servicio:
```cmd
net start MongoDB
```

#### macOS/Linux:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Configurar el Backend

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env (ya está incluido)
# Verificar que MONGO_URL="mongodb://localhost:27017" esté correcto
```

### 4. Configurar el Frontend

```bash
# Navegar a la carpeta frontend
cd ../frontend

# Instalar dependencias
npm install
# o si prefieres yarn:
yarn install
```

### 5. Configurar Variables de Entorno

El juego incluye archivos `.env` pre-configurados:

**backend/.env**:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=guardianes_plantas_peru
CORS_ORIGINS=http://localhost:3000
```

**frontend/.env**:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🎯 Ejecutar el Juego

### Método 1: Ejecutar por Separado

#### Terminal 1 - Backend:
```bash
cd backend
# Activar entorno virtual si no está activo
source venv/bin/activate  # macOS/Linux
# o
venv\Scripts\activate     # Windows

# Ejecutar servidor backend
python server.py
```
El backend estará disponible en: http://localhost:8001

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
# o
yarn start
```
El juego estará disponible en: http://localhost:3000

### Método 2: Usar el Script de Inicio (Recomendado)

```bash
# Hacer ejecutable (Linux/macOS)
chmod +x start_game.sh
./start_game.sh

# Windows
start_game.bat
```

## 🎮 Cómo Jugar

1. **Ingresa tu nombre** para comenzar la aventura
2. **Selecciona un nivel** del menú principal
3. **Completa los objetivos** de cada nivel:
   - Nivel 1: Limpia 3 elementos contaminantes
   - Nivel 2: Planta 12 plantas de muña
   - Nivel 3: Crea 3 infusiones medicinales
   - Nivel 4: Cosecha maíz morado exitosamente
   - Nivel 5: Responde correctamente el quiz
4. **Desbloquea logros** y acumula puntos
5. **Aprende** sobre las plantas medicinales del Perú

## 🏆 Sistema de Puntuación

- **Progreso del jugador** se guarda automáticamente
- **Puntuación por nivel** basada en eficiencia y conocimiento
- **Logros especiales** por completar objetivos específicos
- **Tabla de clasificación** para comparar con otros jugadores

## 🌱 Plantas Incluidas

- **🌿 Muña** (Minthostachys mollis) - Digestiva y respiratoria
- **🌾 Chachacoma** (Senecio nutans) - Contra el mal de altura
- **🌽 Kculli** (Maíz morado) - Rico en antocianinas antioxidantes
- **🍃 Información general** sobre plantas medicinales peruanas

## 🔧 Solución de Problemas

### El juego no carga:
```bash
# Verificar que MongoDB esté corriendo
# Windows:
net start MongoDB
# macOS/Linux:
sudo systemctl status mongod
```

### Error de conexión Backend:
```bash
# Verificar que el backend esté corriendo en puerto 8001
curl http://localhost:8001/api/
```

### Error en Frontend:
```bash
# Limpiar cache y reinstalar
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Puertos ocupados:
- Backend usa puerto 8001
- Frontend usa puerto 3000
- MongoDB usa puerto 27017

Si algún puerto está ocupado, puedes cambiarlos en los archivos `.env`.

## 📁 Estructura del Proyecto

```
guardianes-plantas-peru/
├── backend/                 # Servidor FastAPI
│   ├── server.py           # API principal
│   ├── requirements.txt    # Dependencias Python
│   └── .env               # Variables de entorno backend
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes de los niveles
│   │   ├── context/       # Gestión de estado
│   │   ├── App.js         # Componente principal
│   │   └── App.css        # Estilos y animaciones
│   ├── public/            # Archivos estáticos
│   ├── package.json       # Dependencias Node.js
│   └── .env              # Variables de entorno frontend
├── scripts/               # Scripts de utilidad
├── README.md             # Este archivo
├── start_game.sh         # Script inicio Linux/macOS
└── start_game.bat        # Script inicio Windows
```

## 🎓 Valor Educativo

Este juego enseña sobre:
- **Biodiversidad peruana** y su importancia
- **Plantas medicinales tradicionales** y sus usos
- **Conservación ambiental** y sostenibilidad
- **Cultura ancestral** y conocimiento tradicional
- **Ciencias naturales** aplicadas al cultivo

## 🤝 Contribuir

¿Quieres mejorar el juego? ¡Todas las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 🌟 Créditos

- **Concepto y Diseño**: Basado en el conocimiento tradicional peruano
- **Desarrollo**: Creado con amor para preservar nuestra cultura
- **Plantas Medicinales**: Información basada en investigación etnobotánica

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la sección de **Solución de Problemas**
2. Abre un **Issue** en el repositorio
3. Contacta al desarrollador

---

¡Gracias por jugar y aprender sobre las plantas medicinales del Perú! 🇵🇪🌿