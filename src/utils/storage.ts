import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';

const STORAGE_KEY = '@chaellengeaepp_state';

const defaultState: AppState = {
  currentChallenge: null,
  completedChallenges: [],
  unlockedAchievements: [],
  stats: {
    totalPoints: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    totalCompleted: 0,
    totalSkipped: 0,
    categoryStats: {
      kreativ: 0,
      sportlich: 0,
      lustig: 0,
      sozial: 0,
      experiment: 0,
    },
  },
  settings: {
    favoriteCategories: ['kreativ', 'sportlich', 'lustig', 'sozial', 'experiment'],
    preferredDifficulty: 'mittel',
    notificationsEnabled: true,
    notificationTime: '09:00',
    theme: 'light',
  },
  seenChallengeIds: [],
  lastChallengeDate: null,
};

export const loadState = async (): Promise<AppState> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue !== null) {
      const savedState = JSON.parse(jsonValue);
      // Merge with default state to ensure all fields exist
      return {
        ...defaultState,
        ...savedState,
        stats: {
          ...defaultState.stats,
          ...savedState.stats,
          categoryStats: {
            ...defaultState.stats.categoryStats,
            ...savedState.stats?.categoryStats,
          },
        },
        settings: {
          ...defaultState.settings,
          ...savedState.settings,
        },
      };
    }
    return defaultState;
  } catch (error) {
    console.error('Error loading state:', error);
    return defaultState;
  }
};

export const saveState = async (state: AppState): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving state:', error);
  }
};

export const clearState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing state:', error);
  }
};

export { defaultState };
