import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Home } from 'lucide-react';

const Level5 = () => {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '', visible: false });
  const [gameCompleted, setGameCompleted] = useState(false);

  const questions = [
    {
      question: "¿Cuál es el nombre científico de la Muña y a qué altitud crece principalmente?",
      options: [
        "Minthostachys mollis - Entre 2,700 y 3,400 m.s.n.m.",
        "Senecio graveolens - Entre 3,500 y 4,000 m.s.n.m.",
        "Zea mays - Entre 1,000 y 2,000 m.s.n.m."
      ],
      correct: 0
    },
    {
      question: "¿Cuál es el principal componente antioxidante del maíz morado y qué beneficios aporta?",
      options: [
        "Flavonoides - Ayuda a la digestión",
        "Antocianinas - Protege contra el cáncer y enfermedades cardiovasculares",
        "Vitamina C - Fortalece el sistema inmunológico"
      ],
      correct: 1
    },
    {
      question: "¿Para qué se utiliza tradicionalmente la chachacoma en las comunidades andinas?",
      options: [
        "Para curar heridas y cortes",
        "Para combatir el mal de altura y problemas digestivos",
        "Para teñir textiles de colores naturales"
      ],
      correct: 1
    },
    {
      question: "¿Cuáles son los principales beneficios medicinales de la Muña?",
      options: [
        "Solo alivia problemas digestivos",
        "Únicamente trata enfermedades de la piel",
        "Alivia enfermedades respiratorias, problemas digestivos y tiene propiedades antisépticas"
      ],
      correct: 2
    },
    {
      question: "¿Qué propiedades especiales han descubierto los científicos en la chachacoma?",
      options: [
        "Propiedades anticancerígenas y antimicrobianas",
        "Solo propiedades nutritivas",
        "Únicamente propiedades aromáticas"
      ],
      correct: 0
    }
  ];

  const selectOption = (selectedIndex) => {
    if (answered) return;
    
    const question = questions[currentQuestion];
    let feedbackText, feedbackType;
    
    if (selectedIndex === question.correct) {
      setScore(prev => prev + 1);
      feedbackText = '¡Correcto! Excelente conocimiento sobre las plantas peruanas.';
      feedbackType = 'correct';
    } else {
      feedbackText = 'Incorrecto. La respuesta correcta era: ' + question.options[question.correct];
      feedbackType = 'incorrect';
    }
    
    setFeedback({ text: feedbackText, type: feedbackType, visible: true });
    setAnswered(true);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setAnswered(false);
      setFeedback({ text: '', type: '', visible: false });
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameCompleted(true);
    // Completar nivel con puntuación basada en respuestas correctas
    const finalScore = (score / questions.length) * 100;
    completeLevel(5, Math.round(finalScore)).catch(console.error);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setFeedback({ text: '', type: '', visible: false });
    setGameCompleted(false);
  };

  const goToMenu = () => navigate('/');

  const currentQ = questions[currentQuestion];

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-green-400 p-4">
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
            🌿 Maestro de Plantas del Perú 🌿
          </h1>
          
          <div className="w-32"></div>
        </div>

        <div className="max-w-4xl mx-auto bg-white/95 rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold text-green-800 mb-4">¡Felicitaciones!</h2>
          <p className="text-xl text-gray-700 mb-6">
            Has completado todos los niveles del juego sobre las plantas medicinales del Perú
          </p>
          
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-yellow-800 mb-2">Tu Puntuación Final</h3>
            <p className="text-4xl font-bold text-yellow-600">{score}/{questions.length}</p>
            <p className="text-lg text-yellow-700">
              {score === questions.length ? '¡Perfecto! Eres un verdadero experto' :
               score >= 4 ? '¡Excelente! Tienes un gran conocimiento' :
               score >= 3 ? '¡Muy bien! Buen conocimiento de las plantas' :
               '¡Sigue aprendiendo sobre nuestras plantas ancestrales!'}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4">¡Gracias por jugar!</h3>
            <p className="text-lg mb-4">
              Ahora conoces más sobre el poder curativo de nuestras plantas ancestrales del Perú:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>• 🌿 Muña - Para problemas digestivos y respiratorios</div>
              <div>• 🌾 Chachacoma - Contra el mal de altura</div>
              <div>• 🌽 Kculli - Rico en antocianinas protectoras</div>
              <div>• 🇵🇪 Preservemos nuestra biodiversidad</div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all"
            >
              🔄 Jugar de Nuevo
            </button>
            <button
              onClick={goToMenu}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Menú Principal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-green-400 p-4">
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
          🌿 Maestro de Plantas del Perú 🌿
        </h1>
        
        <div className="w-32"></div>
      </div>

      <div className="max-w-4xl mx-auto bg-white/95 rounded-2xl shadow-2xl p-6">
        {/* Game Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl p-6 mb-6 text-center">
          <div className="text-4xl mb-2">🌿</div>
          <h2 className="text-2xl font-bold mb-2">Lo que aprendimos sobre las plantas del Perú</h2>
          <p className="text-lg opacity-90">¡Descubre el poder curativo de nuestras plantas ancestrales!</p>
        </div>

        {/* Question Container */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-4 border-green-500">
          <div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold text-xl mb-4 inline-block">
            Pregunta {currentQuestion + 1} de {questions.length}
          </div>
          
          <div className="text-xl text-gray-800 mb-6 leading-relaxed">
            {currentQ.question}
          </div>
          
          <div className="space-y-4 mb-6">
            {currentQ.options.map((option, index) => {
              let buttonClass = 'w-full p-4 text-left rounded-xl border-2 border-gray-300 bg-white hover:bg-green-50 hover:border-green-500 transition-all text-lg';
              
              if (answered) {
                if (index === currentQ.correct) {
                  buttonClass = 'w-full p-4 text-left rounded-xl border-2 border-green-500 bg-green-500 text-white text-lg cursor-default';
                } else {
                  buttonClass = 'w-full p-4 text-left rounded-xl border-2 border-red-500 bg-red-500 text-white text-lg cursor-default opacity-50';
                }
              }
              
              return (
                <button
                  key={index}
                  onClick={() => selectOption(index)}
                  disabled={answered}
                  className={buttonClass}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback.visible && (
            <div className={`p-4 rounded-xl font-bold text-lg mb-4 ${
              feedback.type === 'correct' 
                ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}>
              {feedback.text}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          {answered && (
            <button
              onClick={nextQuestion}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all"
            >
              {currentQuestion + 1 < questions.length ? 'Siguiente Pregunta' : 'Ver Resultados'}
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-500"
              style={{ width: `${((currentQuestion + (answered ? 1 : 0)) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Progreso: {currentQuestion + (answered ? 1 : 0)}/{questions.length} | Puntuación actual: {score}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Level5;