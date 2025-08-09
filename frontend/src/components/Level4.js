import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Home } from 'lucide-react';

const Level4 = () => {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  
  const [gameState, setGameState] = useState({
    water: 50,
    sun: 80,
    nutrients: 60,
    health: 70,
    day: 1,
    lastWatered: 0,
    lastFertilized: 0,
    gameOver: false,
    harvestScore: 0,
    showHarvestGame: false,
    gameCompleted: false
  });

  const [message, setMessage] = useState({ text: '', type: '', visible: false });
  const [educationalFact, setEducationalFact] = useState({ text: '', visible: false });
  const [harvestGameState, setHarvestGameState] = useState({
    timeLeft: 10,
    score: 0,
    isActive: false
  });

  // Mensajes educativos
  const educationalFacts = [
    "📚 ¿Sabías que el maíz morado tiene antioxidantes que protegen tu corazón?",
    "📚 El pigmento morado del maíz tiene antocianinas, antioxidantes naturales que ayudan al sistema circulatorio.",
    "📚 El Kculli es una variedad ancestral cultivada en el valle del Colca desde tiempos preincaicos.",
    "📚 Las antocianinas del maíz morado pueden ayudar a reducir la inflamación en el cuerpo.",
    "📚 El maíz morado del Colca es rico en fibra y ayuda a la digestión."
  ];

  // Eventos especiales
  const specialEvents = [
    {
      day: 3,
      type: "rain",
      message: "🌧️ ¡Lluvia intensa! No necesitas regar hoy.",
      effect: () => {
        setGameState(prev => ({
          ...prev,
          water: Math.min(100, prev.water + 20),
          lastWatered: prev.day
        }));
      }
    },
    {
      day: 4,
      type: "plague",
      message: "🪲 ¡Plaga de gusanos en las hojas! Aplica fertilizante para combatirla.",
      effect: () => {
        setGameState(prev => ({
          ...prev,
          health: prev.nutrients < 40 ? prev.health - 15 : prev.health
        }));
      }
    },
    {
      day: 6,
      type: "heat",
      message: "🔥 ¡Día muy caluroso! La planta necesita más agua.",
      effect: () => {
        setGameState(prev => ({
          ...prev,
          water: Math.max(0, prev.water - 15)
        }));
      }
    }
  ];

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type, visible: true });
    setTimeout(() => {
      setMessage(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const showEducationalFact = () => {
    const randomFact = educationalFacts[Math.floor(Math.random() * educationalFacts.length)];
    setEducationalFact({ text: randomFact, visible: true });
    setTimeout(() => {
      setEducationalFact(prev => ({ ...prev, visible: false }));
    }, 6000);
  };

  const waterPlant = () => {
    if (gameState.gameOver) return;
    
    const daysSinceLastWatered = gameState.day - gameState.lastWatered;
    
    if (daysSinceLastWatered < 2) {
      showMessage("⚠️ No necesitas regar todavía. El suelo aún está húmedo.", "warning");
      setGameState(prev => ({ ...prev, health: prev.health - 5 }));
      showMessage("💀 ¡Cuidado! Regar demasiado puede pudrir las raíces.", "error");
    } else {
      setGameState(prev => ({
        ...prev,
        water: Math.min(100, prev.water + 30),
        lastWatered: prev.day,
        health: prev.health + 5
      }));
      showMessage("💧 ¡Planta regada correctamente! +5 salud", "success");
    }
  };

  const fertilizePlant = () => {
    if (gameState.gameOver) return;
    
    const daysSinceLastFertilized = gameState.day - gameState.lastFertilized;
    
    if (daysSinceLastFertilized < 3) {
      showMessage("⚠️ Demasiado fertilizante puede dañar la planta.", "warning");
      setGameState(prev => ({ ...prev, health: prev.health - 10 }));
      showMessage("🌽 ¡Las mazorcas saldrán deformes por exceso de fertilizante!", "error");
    } else {
      setGameState(prev => ({
        ...prev,
        nutrients: Math.min(100, prev.nutrients + 40),
        lastFertilized: prev.day,
        health: prev.health + 10
      }));
      showMessage("🌾 ¡Fertilizante aplicado correctamente! +10 salud", "success");
    }
  };

  const nextDay = () => {
    if (gameState.gameOver) return;
    
    setGameState(prev => {
      const newDay = prev.day + 1;
      let newState = {
        ...prev,
        day: newDay,
        water: Math.max(0, prev.water - 15),
        nutrients: Math.max(0, prev.nutrients - 10),
        sun: Math.max(60, prev.sun - 5)
      };

      // Verificar condiciones de salud
      let healthChange = 0;
      if (newState.water < 20) {
        healthChange -= 10;
        setTimeout(() => showMessage("🏜️ La planta necesita agua urgentemente.", "error"), 500);
      }
      
      if (newState.sun < 60) {
        healthChange -= 15;
        setTimeout(() => showMessage("☁️ Sin suficiente sol, la planta deja de crecer.", "error"), 500);
      }
      
      if (newState.nutrients < 20) {
        healthChange -= 5;
        setTimeout(() => showMessage("🌾 La planta necesita más nutrientes.", "warning"), 500);
      }

      newState.health += healthChange;

      // Eventos especiales
      const todayEvent = specialEvents.find(event => event.day === newDay);
      if (todayEvent) {
        setTimeout(() => {
          showMessage(todayEvent.message, "warning");
          todayEvent.effect();
        }, 1000);
      }
      
      // Mostrar datos educativos
      if (newDay === 5) {
        setTimeout(() => showEducationalFact(), 1500);
      }
      
      // Verificar condiciones de victoria
      if (newDay >= 7) {
        if (newState.health >= 90) {
          setTimeout(() => {
            setGameState(prev => ({ ...prev, showHarvestGame: true }));
            startHarvestMiniGame();
          }, 2000);
        } else {
          setTimeout(() => endGame(false), 2000);
        }
      }
      
      // Verificar si la planta murió
      if (newState.health <= 0) {
        setTimeout(() => endGame(false), 1000);
      }

      return newState;
    });
  };

  const startHarvestMiniGame = () => {
    setHarvestGameState({
      timeLeft: 10,
      score: 0,
      isActive: true
    });

    // Crear temporizador
    const timer = setInterval(() => {
      setHarvestGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          clearInterval(timer);
          endGame(true, prev.score);
          return { ...prev, timeLeft: 0, isActive: false };
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);
  };

  const harvestCorn = (isLarge = false) => {
    if (!harvestGameState.isActive) return;
    
    const points = isLarge ? 10 : 5;
    setHarvestGameState(prev => ({
      ...prev,
      score: prev.score + points
    }));
  };

  const endGame = (success, harvestScore = 0) => {
    setGameState(prev => ({ 
      ...prev, 
      gameOver: true, 
      harvestScore,
      gameCompleted: success 
    }));
    
    if (success) {
      // Completar nivel con puntuación basada en salud final y cosecha
      const finalScore = Math.round((gameState.health + harvestScore) / 2);
      completeLevel(4, finalScore).catch(console.error);
    }
  };

  const restartGame = () => {
    setGameState({
      water: 50,
      sun: 80,
      nutrients: 60,
      health: 70,
      day: 1,
      lastWatered: 0,
      lastFertilized: 0,
      gameOver: false,
      harvestScore: 0,
      showHarvestGame: false,
      gameCompleted: false
    });
    setMessage({ text: '', type: '', visible: false });
    setEducationalFact({ text: '', visible: false });
    setHarvestGameState({ timeLeft: 10, score: 0, isActive: false });
  };

  const getPlantEmoji = () => {
    if (gameState.health > 80) {
      if (gameState.day >= 5) return '🌽';
      else if (gameState.day >= 3) return '🌿';
      else return '🌱';
    } else if (gameState.health < 40) {
      return '🥀';
    } else {
      if (gameState.day >= 4) return '🌿';
      else return '🌱';
    }
  };

  const getPlantClass = () => {
    if (gameState.health > 80) return 'plant healthy';
    else if (gameState.health < 40) return 'plant sick';
    else return 'plant';
  };

  const goToMenu = () => navigate('/');
  const nextLevel = () => navigate('/level/5');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 to-green-300 p-4">
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
          🌽 Kculli Game
        </h1>
        
        <div className="w-32"></div>
      </div>

      <div className="max-w-4xl mx-auto bg-white/95 rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-amber-800 text-center mb-6">
          Cultiva Maíz Morado del Valle del Colca - Arequipa
        </h2>
        
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-400 rounded-xl p-4 text-center transition-all hover:scale-105">
            <div className="text-2xl font-bold text-blue-600">{gameState.water}</div>
            <div className="text-sm text-gray-600">💧 Agua</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-xl p-4 text-center transition-all hover:scale-105">
            <div className="text-2xl font-bold text-yellow-600">{gameState.sun}</div>
            <div className="text-sm text-gray-600">☀️ Sol</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-400 rounded-xl p-4 text-center transition-all hover:scale-105">
            <div className="text-2xl font-bold text-green-600">{gameState.nutrients}</div>
            <div className="text-sm text-gray-600">🌾 Nutrientes</div>
          </div>
          
          <div className="bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-400 rounded-xl p-4 text-center transition-all hover:scale-105">
            <div className="text-2xl font-bold text-red-600">{gameState.health}</div>
            <div className="text-sm text-gray-600">❤️ Salud</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 border-2 border-purple-400 rounded-xl p-4 text-center transition-all hover:scale-105">
            <div className="text-2xl font-bold text-purple-600">{gameState.day}</div>
            <div className="text-sm text-gray-600">📅 Día</div>
          </div>
        </div>

        {/* Plant Container */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 mb-6 min-h-[200px] flex justify-center items-end relative overflow-hidden">
          <div className={`${getPlantClass()} text-6xl transition-all duration-500 ${
            gameState.health > 80 ? 'animate-bounce' : ''
          }`} style={{ 
            filter: gameState.health > 80 
              ? 'drop-shadow(0 5px 15px rgba(0, 255, 0, 0.3))' 
              : gameState.health < 40 
              ? 'drop-shadow(0 5px 15px rgba(255, 0, 0, 0.3)) grayscale(0.5)' 
              : 'drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3))'
          }}>
            {getPlantEmoji()}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={waterPlant}
            disabled={gameState.gameOver}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💧 Regar
          </button>
          
          <button
            onClick={fertilizePlant}
            disabled={gameState.gameOver}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🌾 Fertilizar
          </button>
          
          <button
            onClick={nextDay}
            disabled={gameState.gameOver}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🌅 Siguiente Día
          </button>
        </div>

        {/* Messages */}
        {message.visible && (
          <div className={`p-4 rounded-xl mb-4 font-bold text-lg text-center ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
            message.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
            message.type === 'error' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
            'bg-blue-100 text-blue-800 border-2 border-blue-300'
          }`}>
            {message.text}
          </div>
        )}

        {educationalFact.visible && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-4 mb-4 text-blue-800 font-bold text-lg text-center">
            {educationalFact.text}
          </div>
        )}

        {/* Harvest Game */}
        {gameState.showHarvestGame && (
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 border-2 border-purple-400 rounded-2xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-purple-800 text-center mb-4">
              🎉 ¡Felicidades! Tu Kculli está listo para cosechar
            </h3>
            <p className="text-center mb-4 text-purple-700">
              Haz clic en las mazorcas más grandes y moradas en {harvestGameState.timeLeft} segundos:
            </p>
            
            <div className="grid grid-cols-4 gap-3 mb-4">
              {Array(12).fill(0).map((_, i) => {
                const isLarge = i % 4 === 0; // Cada 4ta mazorca es grande
                return (
                  <div
                    key={i}
                    onClick={() => harvestCorn(isLarge)}
                    className={`
                      ${isLarge 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white text-2xl' 
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xl'
                      } 
                      border-2 border-orange-400 rounded-xl p-4 cursor-pointer transition-all hover:scale-110 hover:shadow-lg
                      flex items-center justify-center
                    `}
                  >
                    🌽
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-purple-700">
                Puntuación: {harvestGameState.score} | Tiempo: {harvestGameState.timeLeft}s
              </div>
            </div>
          </div>
        )}

        {/* Game Over */}
        {gameState.gameOver && (
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-8 text-center">
            {gameState.gameCompleted ? (
              <>
                <h2 className="text-3xl font-bold mb-4">🎉 ¡Felicidades!</h2>
                <p className="text-xl mb-2">🌽 ¡Cosechaste mazorcas de maíz morado perfectas!</p>
                <p className="text-lg mb-2">Puntuación de cosecha: {gameState.harvestScore}</p>
                <p className="text-lg mb-2">🏆 Has aprendido a cultivar Kculli del valle del Colca</p>
                <p className="text-lg mb-6">💜 Recuerda: Las antocianinas del maíz morado protegen tu sistema circulatorio</p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={restartGame}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all"
                  >
                    🔄 Jugar de nuevo
                  </button>
                  <button
                    onClick={nextLevel}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all"
                  >
                    ➡️ Siguiente Nivel
                  </button>
                  <button
                    onClick={goToMenu}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all flex items-center space-x-2"
                  >
                    <Home className="w-5 h-5" />
                    <span>Menú</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">😞 ¡Intenta de nuevo!</h2>
                <p className="text-xl mb-2">Tu planta de Kculli no sobrevivió esta vez.</p>
                <p className="text-lg mb-6">💡 Recuerda: Riega cada 2 días, fertiliza cada 3 días y mantén el sol alto</p>
                
                <button
                  onClick={restartGame}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all"
                >
                  🔄 Intentar de nuevo
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Level4;