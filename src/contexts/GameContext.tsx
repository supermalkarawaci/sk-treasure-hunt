import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Player, Location, GameProgress, Toast } from '../types';

interface GameState {
  player: Player | null;
  locations: Location[];
  progress: GameProgress | null;
  toasts: Toast[];
  isLoading: boolean;
}

type GameAction =
  | { type: 'SET_PLAYER'; payload: Player }
  | { type: 'SET_LOCATIONS'; payload: Location[] }
  | { type: 'SET_PROGRESS'; payload: GameProgress }
  | { type: 'UPDATE_LOCATION_STATUS'; payload: { locationId: string; status: Location['status'] } }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'COMPLETE_LOCATION'; payload: { locationId: string; photo?: string; quizCorrect?: boolean } };

const initialState: GameState = {
  player: null,
  locations: [],
  progress: null,
  toasts: [],
  isLoading: false,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, player: action.payload };
    case 'SET_LOCATIONS':
      return { ...state, locations: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'UPDATE_LOCATION_STATUS':
      return {
        ...state,
        locations: state.locations.map(location =>
          location.id === action.payload.locationId
            ? { ...location, status: action.payload.status }
            : location
        ),
      };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(toast => toast.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'COMPLETE_LOCATION':
      const { locationId, photo, quizCorrect } = action.payload;
      const updatedProgress = state.progress ? {
        ...state.progress,
        completedLocations: [...state.progress.completedLocations, locationId],
        ...(photo && { photos: { ...state.progress.photos, [locationId]: photo } }),
        ...(quizCorrect !== undefined && {
          quizResults: {
            ...state.progress.quizResults,
            [locationId]: { correct: quizCorrect, timestamp: new Date() }
          }
        }),
      } : null;

      return {
        ...state,
        progress: updatedProgress,
        locations: state.locations.map(location =>
          location.id === locationId
            ? { ...location, status: 'completed' }
            : location
        ),
      };
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};