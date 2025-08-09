import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Home, Droplets, Sun, Sprout, Heart, Thermometer } from 'lucide-react';

const Level3 = () => {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  
  const [gameState, setGameState] = useState({
    agua: 45,
    sol: 80,
    nutrientes: 55,
    salud: 100,
    temperatura: 'fría',
    dia: 1,
    diasSaludable: 0,
    puntuacion: 0,
    infusionesCreadas: 0,
    mensajes: [],
    gameOver: false,
    showInfo: false,
    gameCompleted: false
  });

  const [actions, setActions] = useState({
    regar: false,
    fertilizar: false,
    exposerSol: false
  });

  // Información educativa sobre la Chachacoma
  const infoChachacoma = {
    nombre: "Chachacoma (Senecio nutans)",
    habitat: "Crece en las punas altoandinas de Arequipa, entre 3,800-4,500 msnm",
    usos: [
      "Infusión para problemas respiratorios",
      "Alivio del soroche (mal de altura)",
      "Propiedades antiinflamatorias",
      "Estimulante del sistema nervioso"
    ],
    caracteristicas: [
      "Planta perenne de hojas pequeñas y plateadas",
      "Flores amarillas en forma de cabezuelas",
      "Muy resistente al frío extremo",
      "Prefiere suelos secos y bien drenados"
    ],
    datoCurioso: "Se hierve para combatir el soroche (mal de altura). Tiene un aroma muy fuerte y un sabor amargo característico."
  };

  const agregarMensaje = (mensaje, tipo = 'info') => {
    const nuevoMensaje = {
      id: Date.now(),
      texto: mensaje,
      tipo: tipo,
      tiempo: gameState.dia
    };
    
    setGameState(prev => ({
      ...prev,
      mensajes: [nuevoMensaje, ...prev.mensajes.slice(0, 4)]
    }));
  };

  const procesarAcciones = () => {
    setGameState(prev => {
      let nuevoEstado = { ...prev };
      
      // Procesar acciones del jugador
      if (actions.regar) {
        nuevoEstado.agua = Math.min(100, nuevoEstado.agua + 25);
      }
      if (actions.fertilizar) {
        nuevoEstado.nutrientes = Math.min(100, nuevoEstado.nutrientes + 20);
      }
      if (actions.exposerSol) {
        nuevoEstado.sol = Math.min(100, nuevoEstado.sol + 15);
      }

      // Degradación natural diaria
      nuevoEstado.agua = Math.max(0, nuevoEstado.agua - 8);
      nuevoEstado.sol = Math.max(0, nuevoEstado.sol - 5);
      nuevoEstado.nutrientes = Math.max(0, nuevoEstado.nutrientes - 3);

      // Eventos aleatorios de temperatura
      if (Math.random() < 0.2) {
        nuevoEstado.temperatura = 'cálida';
      } else {
        nuevoEstado.temperatura = 'fría';
      }

      return nuevoEstado;
    });

    // Reset actions
    setActions({ regar: false, fertilizar: false, exposerSol: false });
  };

  const calcularSalud = () => {
    setGameState(prev => {
      let nuevaSalud = prev.salud;
      let mensajes = [];

      // Eventos especiales
      if (prev.agua > 70) {
        nuevaSalud -= 15;
        mensajes.push("⚠️ El exceso de agua está pudriendo las raíces de la chachacoma");
      }

      if (prev.temperatura === 'cálida') {
        nuevaSalud -= 20;
        mensajes.push("☀️ Hace demasiado calor para la chachacoma");
      }

      if (prev.sol < 40) {
        nuevaSalud -= 10;
        mensajes.push("🌥️ Le falta sol para crecer bien");
      }

      // Condiciones ideales dan bonificación
      if (prev.agua >= 30 && prev.agua <= 60 && 
          prev.sol >= 60 && prev.sol <= 100 && 
          prev.nutrientes >= 40 && prev.nutrientes <= 70) {
        nuevaSalud += 5;
        mensajes.push("🌿 La chachacoma está en condiciones ideales");
      }

      // Límites de salud
      nuevaSalud = Math.max(0, Math.min(100, nuevaSalud));

      // Contar días saludables
      let diasSaludable = prev.diasSaludable;
      if (nuevaSalud > 80) {
        diasSaludable += 1;
      } else {
        diasSaludable = 0;
      }

      // Recompensa por mantener salud alta
      let infusionesCreadas = prev.infusionesCreadas;
      let puntuacion = prev.puntuacion;
      let gameCompleted = prev.gameCompleted;
      
      if (diasSaludable >= 5) {
        infusionesCreadas += 1;
        puntuacion += 50;
        diasSaludable = 0;
        mensajes.push("🌿 ¡Tu chachacoma está lista para hacer infusión medicinal!");
        
        if (infusionesCreadas >= 3 && !gameCompleted) {
          gameCompleted = true;
          completeLevel(3, puntuacion).catch(console.error);
        }
      }

      // Agregar mensajes
      mensajes.forEach(msg => {
        setTimeout(() => agregarMensaje(msg, msg.includes('⚠️') || msg.includes('☀️') || msg.includes('🌥️') ? 'warning' : 'success'), 500);
      });

      return {
        ...prev,
        salud: nuevaSalud,
        diasSaludable,
        infusionesCreadas,
        puntuacion,
        gameOver: nuevaSalud <= 0,
        gameCompleted
      };
    });
  };

  const avanzarDia = () => {
    procesarAcciones();
    setTimeout(() => {
      setGameState(prev => ({ ...prev, dia: prev.dia + 1 }));
      calcularSalud();
    }, 1000);
  };

  const reiniciarJuego = () => {
    setGameState({
      agua: 45,
      sol: 80,
      nutrientes: 55,
      salud: 100,
      temperatura: 'fría',
      dia: 1,
      diasSaludable: 0,
      puntuacion: 0,
      infusionesCreadas: 0,
      mensajes: [],
      gameOver: false,
      showInfo: false,
      gameCompleted: false
    });
    setActions({ regar: false, fertilizar: false, exposerSol: false });
  };

  const getBarColor = (valor, min, max) => {
    if (valor >= min && valor <= max) return 'bg-green-500';
    if (valor < min) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getStatusIcon = (valor, min, max) => {
    if (valor >= min && valor <= max) return '✅';
    if (valor < min) return '❌';
    return '⚠️';
  };

  const goToMenu = () => navigate('/');
  const nextLevel = () => navigate('/level/4');

  if (gameState.showInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-green-600 p-4">
        <div className="max-w-4xl mx-auto p-6 bg-white/95 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
            📚 Aprende sobre la Chachacoma
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-green-700">🌿 Información General</h3>
              <p className="font-medium text-gray-800">{infoChachacoma.nombre}</p>
              <p className="text-gray-600 mt-2">{infoChachacoma.habitat}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-green-700">🏔️ Características</h3>
              <ul className="space-y-2">
                {infoChachacoma.caracteristicas.map((caracteristica, index) => (
                  <li key={index} className="text-gray-700">• {caracteristica}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 text-green-700">💊 Usos Medicinales</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {infoChachacoma.usos.map((uso, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-green-600">🌿</span>
                  <span className="text-gray-700">{uso}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg shadow-md border border-amber-200 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-amber-700">🔍 Dato Curioso</h3>
            <p className="text-amber-800 font-medium">{infoChachacoma.datoCurioso}</p>
          </div>

          <div className="text-center">
            <button
              onClick={() => setGameState(prev => ({ ...prev, showInfo: false }))}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              🎮 Empezar a Jugar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-green-600 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToMenu}
          className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Menú Principal</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">🌿 Cuidando la Chachacoma</h1>
          <p className="text-white/80">Planta medicinal andina de Arequipa</p>
          <button
            onClick={() => setGameState(prev => ({ ...prev, showInfo: true }))}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            📚 Información de la Planta
          </button>
        </div>
        
        <div className="w-32"></div>
      </div>

      <div className="max-w-4xl mx-auto bg-white/95 rounded-2xl shadow-2xl p-6">
        {/* Estadísticas del juego */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg text-center shadow">
            <div className="text-2xl font-bold text-blue-600">Día {gameState.dia}</div>
            <div className="text-sm text-gray-600">Tiempo</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center shadow">
            <div className="text-2xl font-bold text-green-600">{gameState.puntuacion}</div>
            <div className="text-sm text-gray-600">Puntos</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center shadow">
            <div className="text-2xl font-bold text-purple-600">{gameState.infusionesCreadas}</div>
            <div className="text-sm text-gray-600">Infusiones</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center shadow">
            <div className="text-2xl">{gameState.temperatura === 'fría' ? '❄️' : '☀️'}</div>
            <div className="text-sm text-gray-600">Clima</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Panel de estado de la planta */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-green-700">🌱 Estado de la Chachacoma</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    Agua: {gameState.agua}% {getStatusIcon(gameState.agua, 30, 60)}
                  </span>
                  <span className="text-sm text-gray-600">Ideal: 30-60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${getBarColor(gameState.agua, 30, 60)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${gameState.agua}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    Sol: {gameState.sol}% {getStatusIcon(gameState.sol, 60, 100)}
                  </span>
                  <span className="text-sm text-gray-600">Ideal: 60-100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${getBarColor(gameState.sol, 60, 100)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${gameState.sol}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-500" />
                    Nutrientes: {gameState.nutrientes}% {getStatusIcon(gameState.nutrientes, 40, 70)}
                  </span>
                  <span className="text-sm text-gray-600">Ideal: 40-70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${getBarColor(gameState.nutrientes, 40, 70)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${gameState.nutrientes}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Salud: {gameState.salud}%
                  </span>
                  <span className="text-sm text-gray-600">Días saludables: {gameState.diasSaludable}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${gameState.salud > 60 ? 'bg-green-500' : gameState.salud > 30 ? 'bg-yellow-500' : 'bg-red-500'} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${gameState.salud}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de acciones */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-green-700">🔧 Acciones Diarias</h3>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setActions(prev => ({ ...prev, regar: !prev.regar }))}
                className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                  actions.regar ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Regar (+25 agua)
                </span>
                {actions.regar && <span>✓</span>}
              </button>

              <button
                onClick={() => setActions(prev => ({ ...prev, fertilizar: !prev.fertilizar }))}
                className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                  actions.fertilizar ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sprout className="w-5 h-5" />
                  Fertilizar (+20 nutrientes)
                </span>
                {actions.fertilizar && <span>✓</span>}
              </button>

              <button
                onClick={() => setActions(prev => ({ ...prev, exposerSol: !prev.exposerSol }))}
                className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                  actions.exposerSol ? 'bg-yellow-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Exponer al sol (+15 sol)
                </span>
                {actions.exposerSol && <span>✓</span>}
              </button>
            </div>

            <button
              onClick={avanzarDia}
              disabled={gameState.gameOver}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              ⏭️ Avanzar Día
            </button>

            {gameState.gameOver && (
              <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-center">
                <h4 className="font-bold text-red-700 mb-2">💀 ¡La chachacoma murió!</h4>
                <p className="text-red-600 mb-3">Puntuación final: {gameState.puntuacion}</p>
                <button
                  onClick={reiniciarJuego}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  🔄 Jugar de Nuevo
                </button>
              </div>
            )}

            {gameState.gameCompleted && (
              <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
                <h4 className="font-bold text-green-700 mb-2">🎉 ¡Nivel Completado!</h4>
                <p className="text-green-600 mb-3">¡Creaste 3 infusiones medicinales!</p>
                <div className="flex space-x-2">
                  <button
                    onClick={nextLevel}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    ➡️ Siguiente
                  </button>
                  <button
                    onClick={goToMenu}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Home className="w-4 h-4" />
                    <span>Menú</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mensajes del juego */}
        {gameState.mensajes.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold mb-3 text-gray-700">📢 Mensajes del Juego</h4>
            <div className="space-y-2">
              {gameState.mensajes.map((mensaje) => (
                <div 
                  key={mensaje.id} 
                  className={`p-2 rounded ${
                    mensaje.tipo === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                    mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}
                >
                  <span className="text-sm text-gray-600">Día {mensaje.tiempo}: </span>
                  {mensaje.texto}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consejos */}
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold mb-2 text-yellow-800">💡 Consejos para cuidar la Chachacoma:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Evita regar en exceso - prefiere suelos secos</li>
            <li>• Necesita mucho sol, como en las punas altoandinas</li>
            <li>• No requiere muchos nutrientes, es resistente</li>
            <li>• Mantén la salud alta por 5 días para crear infusiones medicinales</li>
            <li>• Crea 3 infusiones para completar el nivel</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Level3;