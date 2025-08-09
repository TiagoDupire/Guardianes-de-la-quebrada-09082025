import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { TreePine, Leaf, FlowerIcon, Wheat, BookOpen, Star, Trophy, User } from 'lucide-react';

const GameMenu = () => {
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const { player, loading, createPlayer, loadPlayer } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!player.name) {
      const savedName = localStorage.getItem('playerName');
      if (savedName) {
        loadPlayer(savedName);
      } else {
        setShowNameInput(true);
      }
    }
  }, [player.name, loadPlayer]);

  const handlePlayerSetup = async (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      try {
        await createPlayer(playerName.trim());
        setShowNameInput(false);
      } catch (error) {
        alert('Error al crear jugador: ' + error.message);
      }
    }
  };

  const handleStartLevel = (levelNumber) => {
    if (levelNumber <= player.currentLevel) {
      navigate(`/level/${levelNumber}`);
    }
  };

  const levels = [
    {
      number: 1,
      title: "Guardianes de la Quebrada",
      description: "Limpia el ecosistema de contaminantes",
      icon: <TreePine className="w-8 h-8" />,
      color: "bg-green-500",
      completed: player.levelsCompleted?.includes(1)
    },
    {
      number: 2,
      title: "Guardián de la Muña",
      description: "Cultiva muña en las alturas de Arequipa",
      icon: <Leaf className="w-8 h-8" />,
      color: "bg-emerald-500",
      completed: player.levelsCompleted?.includes(2)
    },
    {
      number: 3,
      title: "Cuidando la Chachacoma",
      description: "Cuida la planta medicinal andina",
      icon: <FlowerIcon className="w-8 h-8" />,
      color: "bg-blue-500",
      completed: player.levelsCompleted?.includes(3)
    },
    {
      number: 4,
      title: "Kculli - Maíz Morado",
      description: "Cultiva maíz morado del Valle del Colca",
      icon: <Wheat className="w-8 h-8" />,
      color: "bg-purple-500",
      completed: player.levelsCompleted?.includes(4)
    },
    {
      number: 5,
      title: "Maestro de Plantas",
      description: "Pon a prueba tus conocimientos",
      icon: <BookOpen className="w-8 h-8" />,
      color: "bg-orange-500",
      completed: player.levelsCompleted?.includes(5)
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌿</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Guardianes de las Plantas del Perú
            </h1>
            <p className="text-gray-600">
              Descubre el poder curativo de nuestras plantas ancestrales
            </p>
          </div>
          
          <form onSubmit={handlePlayerSetup} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                ¿Cómo te llamas, guardián?
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tu nombre"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Comenzar Aventura'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-5xl font-bold mb-4">🌿 Guardianes de las Plantas del Perú</h1>
          <p className="text-xl opacity-90">Explora el poder curativo de nuestras plantas ancestrales</p>
        </div>

        {/* Player Info */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">¡Bienvenido, {player.name}!</h2>
                <p className="opacity-80">Nivel actual: {player.currentLevel}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span className="text-xl font-bold">{player.totalScore || 0}</span>
                </div>
                <p className="text-sm opacity-80">Puntos</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span className="text-xl font-bold">{player.levelsCompleted?.length || 0}/5</span>
                </div>
                <p className="text-sm opacity-80">Completados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => {
            const isUnlocked = level.number <= player.currentLevel;
            const score = player.levelScores?.[level.number] || 0;
            
            return (
              <div
                key={level.number}
                className={`
                  relative bg-white rounded-2xl shadow-xl p-6 transition-all duration-300
                  ${isUnlocked 
                    ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' 
                    : 'opacity-50 cursor-not-allowed'
                  }
                `}
                onClick={() => isUnlocked && handleStartLevel(level.number)}
              >
                {/* Level number badge */}
                <div className={`absolute -top-3 -left-3 w-10 h-10 ${level.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {level.number}
                </div>
                
                {/* Completion badge */}
                {level.completed && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                    <Star className="w-6 h-6 text-yellow-800" fill="currentColor" />
                  </div>
                )}
                
                <div className="pt-4">
                  <div className={`${level.color} text-white p-4 rounded-xl mb-4 inline-block`}>
                    {level.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {level.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {level.description}
                  </p>
                  
                  {level.completed && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block text-sm font-medium mb-2">
                      Puntuación: {score}
                    </div>
                  )}
                  
                  <div className={`
                    py-2 px-4 rounded-lg text-center font-medium
                    ${isUnlocked 
                      ? level.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-500'
                    }
                  `}>
                    {!isUnlocked ? '🔒 Bloqueado' : 
                     level.completed ? '✅ Completado' : '▶️ Jugar Ahora'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        {player.achievements && player.achievements.length > 0 && (
          <div className="mt-8 bg-white/20 backdrop-blur-md rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              Logros Conseguidos
            </h3>
            <div className="flex flex-wrap gap-2">
              {player.achievements.map((achievement, index) => (
                <div key={index} className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                  🏆 {achievement === 'first_level' ? 'Primer Nivel' : 
                       achievement === 'game_master' ? 'Maestro del Juego' :
                       achievement === 'high_scorer' ? 'Puntuación Alta' : achievement}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-white/80 mt-8 pb-4">
          <p className="text-lg">🇵🇪 Preservemos juntos la sabiduría ancestral del Perú 🌿</p>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;