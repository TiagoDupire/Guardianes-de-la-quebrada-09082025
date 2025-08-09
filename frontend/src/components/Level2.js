import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Home } from 'lucide-react';

const Level2 = () => {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  
  const [gameState, setGameState] = useState({
    fertilizedPatches: 0,
    plantedPatches: 0,
    fertilizerCount: 10,
    selectedTool: null,
    patches: Array(24).fill().map(() => ({ fertilized: false, planted: false })),
    gameCompleted: false
  });
  
  const [message, setMessage] = useState({ text: '', type: '', visible: false });

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type, visible: true });
    setTimeout(() => {
      setMessage(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const selectTool = (tool) => {
    setGameState(prev => ({ ...prev, selectedTool: tool }));
  };

  const handlePatchClick = (index) => {
    const patch = gameState.patches[index];
    
    if (gameState.selectedTool === 'fertilizer' && !patch.fertilized && gameState.fertilizerCount > 0) {
      fertilizePatch(index);
    } else if (gameState.selectedTool === 'plant' && patch.fertilized && !patch.planted) {
      plantMuna(index);
    } else if (gameState.selectedTool === 'fertilizer' && gameState.fertilizerCount === 0) {
      showMessage('¡No tienes más fertilizante! Usa sabiamente los recursos.', 'warning');
    } else if (gameState.selectedTool === 'plant' && !patch.fertilized) {
      showMessage('¡Primero debes fertilizar la tierra!', 'warning');
    } else if (gameState.selectedTool === 'plant' && patch.planted) {
      showMessage('¡Ya hay una planta de muña aquí!', 'warning');
    }
  };

  const fertilizePatch = (index) => {
    setGameState(prev => {
      const newPatches = [...prev.patches];
      newPatches[index].fertilized = true;
      
      return {
        ...prev,
        patches: newPatches,
        fertilizedPatches: prev.fertilizedPatches + 1,
        fertilizerCount: prev.fertilizerCount - 1
      };
    });
    
    showMessage('¡Parcela fertilizada! Ahora puedes plantar muña.', 'success');
  };

  const plantMuna = (index) => {
    setGameState(prev => {
      const newPatches = [...prev.patches];
      newPatches[index].planted = true;
      
      const newPlantedCount = prev.plantedPatches + 1;
      const completed = newPlantedCount >= 12;
      
      if (completed) {
        // Completar nivel con puntuación basada en eficiencia
        const efficiency = Math.round((newPlantedCount / Math.max(1, (10 - prev.fertilizerCount))) * 100);
        completeLevel(2, efficiency).catch(console.error);
      }
      
      return {
        ...prev,
        patches: newPatches,
        plantedPatches: newPlantedCount,
        gameCompleted: completed
      };
    });
    
    showMessage('¡Muña plantada exitosamente! Contribuyes a la conservación.', 'success');
    
    if (gameState.plantedPatches + 1 >= 12) {
      setTimeout(() => {
        showMessage('¡Felicidades! Has creado un hermoso campo de muña. ¡Eres un verdadero guardián de la biodiversidad andina!', 'success');
      }, 1000);
    }
  };

  const resetGame = () => {
    setGameState({
      fertilizedPatches: 0,
      plantedPatches: 0,
      fertilizerCount: 10,
      selectedTool: null,
      patches: Array(24).fill().map(() => ({ fertilized: false, planted: false })),
      gameCompleted: false
    });
    setMessage({ text: '', type: '', visible: false });
  };

  const goToMenu = () => navigate('/');
  const nextLevel = () => navigate('/level/3');

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
        
        <h1 className="text-3xl font-bold text-white text-center">
          🌿 Guardián de la Muña 🌿
        </h1>
        
        <div className="w-32"></div>
      </div>

      <div className="max-w-4xl mx-auto bg-white/95 rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Cultiva y protege la muña en las alturas de Arequipa</h2>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-400 rounded-xl p-4 text-center">
            <h3 className="text-green-700 font-bold mb-2">Parcelas Fertilizadas</h3>
            <p className="text-2xl font-bold text-blue-600">{gameState.fertilizedPatches}</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-400 rounded-xl p-4 text-center">
            <h3 className="text-green-700 font-bold mb-2">Plantas de Muña</h3>
            <p className="text-2xl font-bold text-green-600">{gameState.plantedPatches}</p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-xl p-4 text-center">
            <h3 className="text-green-700 font-bold mb-2">Fertilizante</h3>
            <p className="text-2xl font-bold text-yellow-600">{gameState.fertilizerCount}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-xl h-6 mb-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-xl transition-all duration-500"
            style={{ width: `${(gameState.plantedPatches / 12) * 100}%` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => selectTool('fertilizer')}
            className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
              gameState.selectedTool === 'fertilizer'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white scale-110 shadow-lg'
                : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 hover:scale-105'
            }`}
          >
            💧 Fertilizar
          </button>
          
          <button
            onClick={() => selectTool('plant')}
            className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
              gameState.selectedTool === 'plant'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white scale-110 shadow-lg'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105'
            }`}
          >
            🌱 Plantar Muña
          </button>
          
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl font-bold text-lg hover:scale-105 transition-all"
          >
            🔄 Reiniciar
          </button>
        </div>

        {/* Message */}
        {message.visible && (
          <div className={`mb-4 p-4 rounded-xl text-center font-bold text-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
            message.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
            'bg-blue-100 text-blue-800 border-2 border-blue-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Game Field */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-700 to-amber-700 rounded-2xl p-6 mb-6 min-h-[300px]">
          <div className="grid grid-cols-6 gap-3 h-full">
            {gameState.patches.map((patch, index) => (
              <div
                key={index}
                onClick={() => handlePatchClick(index)}
                className={`
                  border-2 rounded-lg p-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[60px] flex items-center justify-center text-2xl
                  ${patch.planted 
                    ? 'bg-green-500 border-green-600' 
                    : patch.fertilized 
                    ? 'bg-amber-600 border-amber-700' 
                    : 'bg-amber-800 border-amber-900'
                  }
                `}
              >
                {patch.planted ? '🌿' : patch.fertilized ? '✨' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Game Completion */}
        {gameState.gameCompleted && (
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl mb-4">
              <h3 className="text-2xl font-bold mb-2">🎉 ¡Nivel Completado! 🎉</h3>
              <p className="text-lg">¡Has cultivado con éxito un campo de muña!</p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={nextLevel}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all"
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
          </div>
        )}

        {/* Educational Panel */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-2xl p-6 mt-6">
          <h3 className="text-xl font-bold text-green-700 mb-4">🎓 Aprende sobre la Muña</h3>
          <ul className="text-blue-700 space-y-2">
            <li><strong>Habitat:</strong> Crece en altitudes de 2,500 a 4,000 metros en Caylloma y Castilla, Arequipa</li>
            <li><strong>Propiedades:</strong> Planta aromática con propiedades medicinales y digestivas</li>
            <li><strong>Cultivo:</strong> Necesita suelo bien drenado y fertilizado con materia orgánica</li>
            <li><strong>Importancia:</strong> Parte fundamental de la medicina tradicional andina</li>
            <li><strong>Conservación:</strong> Vulnerable por la recolección excesiva y cambio climático</li>
            <li><strong>Dato curioso:</strong> Es usada tradicionalmente como infusión para aliviar dolores estomacales y mal de altura. Su aroma es mentolado</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Level2;