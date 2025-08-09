import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Home } from 'lucide-react';

const Level1 = () => {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  
  const [gameState, setGameState] = useState({
    health: 0,
    cleaned: 0,
    total: 3,
    isPlaying: false,
    showVictory: false
  });
  
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'game', 'victory'

  const startGame = () => {
    setCurrentScreen('game');
    setGameState(prev => ({ ...prev, isPlaying: true }));
  };

  const removeContaminant = (element) => {
    if (!gameState.isPlaying) return;
    
    // Crear efecto visual
    element.style.animation = 'fadeOut 0.5s ease-out forwards';
    
    setTimeout(() => {
      setGameState(prev => {
        const newCleaned = prev.cleaned + 1;
        const newHealth = Math.min(100, Math.round((newCleaned / prev.total) * 100));
        
        if (newCleaned >= prev.total) {
          setTimeout(() => {
            setCurrentScreen('victory');
            // Completar nivel con puntuación
            completeLevel(1, 100).catch(console.error);
          }, 1000);
        }
        
        return {
          ...prev,
          cleaned: newCleaned,
          health: newHealth
        };
      });
      
      element.remove();
    }, 500);
  };

  const resetGame = () => {
    setGameState({
      health: 0,
      cleaned: 0,
      total: 3,
      isPlaying: false,
      showVictory: false
    });
    setCurrentScreen('start');
  };

  const goToMenu = () => {
    navigate('/');
  };

  const nextLevel = () => {
    navigate('/level/2');
  };

  useEffect(() => {
    // Crear nubes flotantes
    const createCloud = () => {
      const cloud = document.createElement('div');
      cloud.innerHTML = '☁️';
      cloud.style.position = 'absolute';
      cloud.style.fontSize = '2rem';
      cloud.style.top = Math.random() * 100 + 'px';
      cloud.style.left = '-50px';
      cloud.style.animation = 'floatRight 20s linear infinite';
      cloud.style.opacity = '0.7';
      cloud.style.zIndex = '1';
      cloud.style.pointerEvents = 'none';
      
      const gameContainer = document.querySelector('.level1-game-container');
      if (gameContainer) {
        gameContainer.appendChild(cloud);
        setTimeout(() => cloud.remove(), 20000);
      }
    };

    const interval = setInterval(createCloud, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToMenu}
          className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Menú Principal</span>
        </button>
        
        <h1 className="text-3xl font-bold text-white text-center">
          🌿 Guardianes de la Quebrada 🌿
        </h1>
        
        <div className="w-32"></div> {/* Spacer */}
      </div>

      <div className="level1-game-container relative w-full max-w-4xl mx-auto bg-sky-300 rounded-3xl shadow-2xl overflow-hidden" style={{ height: '600px' }}>
        
        {/* Pantalla de Inicio */}
        {currentScreen === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white">
            <h1 className="text-5xl font-bold mb-4 text-shadow-lg">🌿 Guardianes de la Quebrada 🌿</h1>
            <p className="text-xl mb-8">Ayuda a restaurar nuestro ecosistema</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg"
            >
              Comenzar Misión
            </button>
          </div>
        )}

        {/* Pantalla de Juego */}
        {currentScreen === 'game' && (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-green-200 to-green-300 relative overflow-hidden">
            {/* Montañas */}
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-r from-amber-600 to-amber-700"
              style={{
                height: '200px',
                clipPath: 'polygon(0 100%, 20% 40%, 40% 60%, 60% 30%, 80% 50%, 100% 100%)'
              }}
            ></div>
            
            {/* Río */}
            <div 
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-24 rounded-t-full border-4 transition-colors duration-1000 ${
                gameState.health >= 67 ? 'bg-gradient-to-b from-blue-400 to-blue-500 border-blue-600' : 'bg-gradient-to-b from-blue-600 to-slate-600 border-slate-700'
              }`}
            ></div>
            
            {/* Árboles */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`absolute bottom-12 w-10 h-20 bg-amber-600 rounded-sm ${
                i === 1 ? 'left-24' : i === 2 ? 'left-48' : i === 3 ? 'right-24' : 'right-48'
              }`}>
                <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full transition-colors duration-1000 ${
                  gameState.cleaned > i - 1 ? 'bg-green-500' : 'bg-amber-600'
                }`}></div>
              </div>
            ))}
            
            {/* Contaminantes */}
            <div
              className="absolute cursor-pointer transition-all duration-300 hover:scale-110 border-4 border-yellow-400 rounded-lg shadow-lg bg-amber-700 w-12 h-12 flex items-center justify-center"
              style={{ left: '150px', bottom: '140px' }}
              onClick={(e) => removeContaminant(e.target)}
            >
              🗑️
            </div>
            
            <div
              className="absolute cursor-pointer transition-all duration-300 hover:scale-110 border-4 border-yellow-400 rounded-full shadow-lg bg-gradient-to-r from-red-500 to-orange-500 w-16 h-16 flex items-center justify-center animate-pulse"
              style={{ left: '250px', bottom: '190px' }}
              onClick={(e) => removeContaminant(e.target)}
            >
              🔥
            </div>
            
            <div
              className="absolute cursor-pointer transition-all duration-300 hover:scale-110 border-4 border-yellow-400 rounded-full shadow-lg bg-slate-700 w-20 h-12 flex items-center justify-center"
              style={{ left: '350px', bottom: '150px' }}
              onClick={(e) => removeContaminant(e.target)}
            >
              🛢️
            </div>
            
            {/* Barra de Estado */}
            <div className="absolute top-5 left-5 bg-white/90 p-4 rounded-xl shadow-lg">
              <div className="text-slate-700 font-semibold">
                <div>Vida del Ecosistema: {gameState.health}/100</div>
                <div>Elementos Limpiados: {gameState.cleaned}/{gameState.total}</div>
              </div>
            </div>
            
            {/* Barra de Progreso */}
            <div className="absolute top-5 right-5 w-48 h-8 bg-white/90 rounded-full overflow-hidden shadow-lg">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 flex items-center justify-center text-white font-bold text-sm"
                style={{ width: `${gameState.health}%` }}
              >
                {gameState.health}%
              </div>
            </div>
            
            {/* Instrucciones */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white/80 px-6 py-3 rounded-xl text-slate-700 font-medium text-center animate-pulse">
              Haz clic en los elementos contaminantes para limpiar la quebrada (3 elementos)
            </div>
          </div>
        )}

        {/* Pantalla de Victoria */}
        {currentScreen === 'victory' && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 text-white flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-6 animate-bounce">⭐⭐⭐</div>
              <h2 className="text-4xl font-bold mb-4">¡Felicitaciones, Guardián!</h2>
              <p className="text-xl mb-6">Has restaurado exitosamente la quebrada</p>
              
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-2xl mb-6 text-2xl font-bold border-4 border-white/50 animate-pulse shadow-2xl">
                ¡Felicidades, ahora tu misión será regar tus plantas! 🌱💧
              </div>
              
              <p className="text-lg mb-6 italic">"Félicitations, gardien de la nature !" 🌿</p>
              
              <div className="flex space-x-4">
                <button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  🔄 Jugar de Nuevo
                </button>
                <button
                  onClick={nextLevel}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  ➡️ Siguiente Nivel
                </button>
                <button
                  onClick={goToMenu}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>Menú</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0); }
        }
        
        @keyframes floatRight {
          from { transform: translateX(0); }
          to { transform: translateX(100vw); }
        }
        
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default Level1;