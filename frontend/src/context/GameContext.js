import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GameContext = createContext();

const initialState = {
  player: {
    id: '',
    name: '',
    currentLevel: 1,
    levelsCompleted: [],
    totalScore: 0,
    levelScores: {},
    achievements: []
  },
  loading: false,
  error: null
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PLAYER':
      return { ...state, player: action.payload, loading: false };
    case 'UPDATE_PLAYER':
      return { ...state, player: { ...state.player, ...action.payload } };
    case 'COMPLETE_LEVEL':
      const newLevelsCompleted = state.player.levelsCompleted.includes(action.payload.level)
        ? state.player.levelsCompleted
        : [...state.player.levelsCompleted, action.payload.level];
      
      return {
        ...state,
        player: {
          ...state.player,
          levelsCompleted: newLevelsCompleted,
          currentLevel: Math.max(state.player.currentLevel, action.payload.level + 1),
          levelScores: {
            ...state.player.levelScores,
            [action.payload.level]: Math.max(
              state.player.levelScores[action.payload.level] || 0,
              action.payload.score
            )
          },
          totalScore: state.player.totalScore + action.payload.score
        }
      };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const createPlayer = async (playerName) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.post(`${API}/game/progress`, {
        player_name: playerName
      });
      dispatch({ type: 'SET_PLAYER', payload: {
        id: response.data.id,
        name: response.data.player_name,
        currentLevel: response.data.current_level,
        levelsCompleted: response.data.levels_completed,
        totalScore: response.data.total_score,
        levelScores: response.data.level_scores,
        achievements: response.data.achievements
      }});
      localStorage.setItem('playerName', playerName);
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const loadPlayer = async (playerName) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get(`${API}/game/progress/${playerName}`);
      dispatch({ type: 'SET_PLAYER', payload: {
        id: response.data.id,
        name: response.data.player_name,
        currentLevel: response.data.current_level,
        levelsCompleted: response.data.levels_completed,
        totalScore: response.data.total_score,
        levelScores: response.data.level_scores,
        achievements: response.data.achievements
      }});
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Player doesn't exist, create new one
        return await createPlayer(playerName);
      }
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const completeLevel = async (levelNumber, score, completionTime = null) => {
    try {
      await axios.post(`${API}/game/complete-level`, {
        player_id: state.player.id,
        level_number: levelNumber,
        score: score,
        completion_time: completionTime
      });
      
      dispatch({ type: 'COMPLETE_LEVEL', payload: { level: levelNumber, score } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Auto-load player from localStorage on mount
  useEffect(() => {
    const savedPlayerName = localStorage.getItem('playerName');
    if (savedPlayerName && !state.player.name) {
      loadPlayer(savedPlayerName).catch(console.error);
    }
  }, []);

  const value = {
    ...state,
    createPlayer,
    loadPlayer,
    completeLevel
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameProvider;