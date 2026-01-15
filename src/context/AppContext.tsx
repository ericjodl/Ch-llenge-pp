import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  AppState,
  Challenge,
  ChallengeCategory,
  Difficulty,
  CompletedChallenge,
  Achievement,
} from '../types';
import { loadState, saveState, defaultState } from '../utils/storage';
import {
  getRandomChallenge,
  calculateLevel,
  checkNewAchievements,
  isNewChallengeDay,
  getTodayISO,
  getPointsForDifficulty,
} from '../utils/helpers';

// Action Types
type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'SET_CHALLENGE'; payload: Challenge }
  | { type: 'COMPLETE_CHALLENGE' }
  | { type: 'SKIP_CHALLENGE' }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'RESET_STATE' };

// Reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'SET_CHALLENGE':
      return {
        ...state,
        currentChallenge: action.payload,
        lastChallengeDate: getTodayISO(),
        seenChallengeIds: [...state.seenChallengeIds, action.payload.id],
      };

    case 'COMPLETE_CHALLENGE': {
      if (!state.currentChallenge) return state;

      const challenge = state.currentChallenge;
      const pointsEarned = getPointsForDifficulty(challenge.difficulty);
      const newTotalPoints = state.stats.totalPoints + pointsEarned;
      const newLevel = calculateLevel(newTotalPoints);

      // Update streak
      const today = getTodayISO();
      const completedToday = state.completedChallenges.some(
        (c) => c.date.startsWith(today) && c.status === 'completed'
      );

      let newStreak = state.stats.currentStreak;
      if (!completedToday) {
        // Check if yesterday was completed
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayISO = yesterday.toISOString().split('T')[0];

        const completedYesterday = state.completedChallenges.some(
          (c) => c.date.startsWith(yesterdayISO) && c.status === 'completed'
        );

        if (completedYesterday || state.stats.currentStreak === 0) {
          newStreak = state.stats.currentStreak + 1;
        } else if (state.stats.currentStreak > 0) {
          // Check if this is the first completion today after missing days
          newStreak = 1;
        }
      }

      const newStats = {
        ...state.stats,
        totalPoints: newTotalPoints,
        level: newLevel,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, state.stats.longestStreak),
        totalCompleted: state.stats.totalCompleted + 1,
        categoryStats: {
          ...state.stats.categoryStats,
          [challenge.category]: state.stats.categoryStats[challenge.category] + 1,
        },
      };

      const completedChallenge: CompletedChallenge = {
        challengeId: challenge.id,
        date: new Date().toISOString(),
        status: 'completed',
        pointsEarned,
      };

      // Check for new achievements
      const newAchievements = checkNewAchievements(
        newStats,
        state.unlockedAchievements.map((a) => a.id)
      );

      return {
        ...state,
        currentChallenge: null,
        completedChallenges: [...state.completedChallenges, completedChallenge],
        stats: newStats,
        unlockedAchievements: [...state.unlockedAchievements, ...newAchievements],
      };
    }

    case 'SKIP_CHALLENGE': {
      if (!state.currentChallenge) return state;

      const skippedChallenge: CompletedChallenge = {
        challengeId: state.currentChallenge.id,
        date: new Date().toISOString(),
        status: 'skipped',
        pointsEarned: 0,
      };

      return {
        ...state,
        currentChallenge: null,
        completedChallenges: [...state.completedChallenges, skippedChallenge],
        stats: {
          ...state.stats,
          totalSkipped: state.stats.totalSkipped + 1,
        },
      };
    }

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, action.payload],
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case 'RESET_STATE':
      return defaultState;

    default:
      return state;
  }
};

// Context Types
interface AppContextType {
  state: AppState;
  loading: boolean;
  getNewChallenge: () => void;
  completeChallenge: () => void;
  skipChallenge: () => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  resetState: () => void;
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, defaultState);
  const [loading, setLoading] = React.useState(true);

  // Load saved state on mount
  useEffect(() => {
    const initializeState = async () => {
      const savedState = await loadState();
      dispatch({ type: 'SET_STATE', payload: savedState });
      setLoading(false);
    };
    initializeState();
  }, []);

  // Save state when it changes
  useEffect(() => {
    if (!loading) {
      saveState(state);
    }
  }, [state, loading]);

  // Check for new challenge on load
  useEffect(() => {
    if (!loading && !state.currentChallenge && isNewChallengeDay(state.lastChallengeDate)) {
      getNewChallenge();
    }
  }, [loading]);

  const getNewChallenge = () => {
    const challenge = getRandomChallenge(
      state.settings.favoriteCategories,
      state.settings.preferredDifficulty,
      state.seenChallengeIds
    );
    if (challenge) {
      dispatch({ type: 'SET_CHALLENGE', payload: challenge });
    }
  };

  const completeChallenge = () => {
    dispatch({ type: 'COMPLETE_CHALLENGE' });
  };

  const skipChallenge = () => {
    dispatch({ type: 'SKIP_CHALLENGE' });
  };

  const updateSettings = (settings: Partial<AppState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        loading,
        getNewChallenge,
        completeChallenge,
        skipChallenge,
        updateSettings,
        resetState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
