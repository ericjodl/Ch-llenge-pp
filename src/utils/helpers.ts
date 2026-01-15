import { Challenge, ChallengeCategory, Difficulty, UserStats, Achievement } from '../types';
import { challenges } from '../data/challenges';
import { achievements } from '../data/achievements';
import { LevelConfig, PointsPerDifficulty } from '../constants/theme';

// Holt eine zufällige Challenge basierend auf Benutzereinstellungen
export const getRandomChallenge = (
  favoriteCategories: ChallengeCategory[],
  preferredDifficulty: Difficulty,
  seenIds: string[]
): Challenge | null => {
  // Filter challenges by categories
  let availableChallenges = challenges.filter(
    (c) => favoriteCategories.includes(c.category)
  );

  // Prefer unseen challenges
  const unseenChallenges = availableChallenges.filter(
    (c) => !seenIds.includes(c.id)
  );

  // If all challenges have been seen, reset
  if (unseenChallenges.length > 0) {
    availableChallenges = unseenChallenges;
  }

  // Sort by preferred difficulty (preferred difficulty comes first)
  availableChallenges.sort((a, b) => {
    if (a.difficulty === preferredDifficulty && b.difficulty !== preferredDifficulty) {
      return -1;
    }
    if (b.difficulty === preferredDifficulty && a.difficulty !== preferredDifficulty) {
      return 1;
    }
    return 0;
  });

  // Add some randomness but prefer preferred difficulty
  const preferredCount = availableChallenges.filter(
    (c) => c.difficulty === preferredDifficulty
  ).length;

  // 70% chance to get preferred difficulty if available
  const usePreferred = Math.random() < 0.7 && preferredCount > 0;

  const finalPool = usePreferred
    ? availableChallenges.filter((c) => c.difficulty === preferredDifficulty)
    : availableChallenges;

  if (finalPool.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * finalPool.length);
  return finalPool[randomIndex];
};

// Berechnet das Level basierend auf Punkten
export const calculateLevel = (points: number): number => {
  const level = Math.floor(points / LevelConfig.pointsPerLevel) + 1;
  return Math.min(level, LevelConfig.maxLevel);
};

// Berechnet die Punkte für das nächste Level
export const getPointsForNextLevel = (currentLevel: number): number => {
  return currentLevel * LevelConfig.pointsPerLevel;
};

// Gibt den Leveltitel zurück
export const getLevelTitle = (level: number): string => {
  const index = Math.min(
    Math.floor((level - 1) / 5),
    LevelConfig.levelTitles.length - 1
  );
  return LevelConfig.levelTitles[index];
};

// Prüft neue Achievements
export const checkNewAchievements = (
  stats: UserStats,
  unlockedIds: string[]
): Achievement[] => {
  const newAchievements: Achievement[] = [];

  for (const achievement of achievements) {
    // Bereits freigeschaltet
    if (unlockedIds.includes(achievement.id)) continue;

    let unlocked = false;

    switch (achievement.type) {
      case 'streak':
        unlocked = stats.currentStreak >= achievement.requirement ||
                   stats.longestStreak >= achievement.requirement;
        break;
      case 'total':
        if (achievement.id === 'allrounder') {
          // Special case: check all categories
          unlocked = Object.values(stats.categoryStats).every(
            (count) => count >= achievement.requirement
          );
        } else {
          unlocked = stats.totalCompleted >= achievement.requirement;
        }
        break;
      case 'category':
        if (achievement.category) {
          unlocked = stats.categoryStats[achievement.category] >= achievement.requirement;
        }
        break;
    }

    if (unlocked) {
      newAchievements.push({
        ...achievement,
        unlockedAt: new Date().toISOString(),
      });
    }
  }

  return newAchievements;
};

// Formatiert Datum für Anzeige
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Formatiert Datum kurz
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Prüft ob heute eine neue Challenge fällig ist
export const isNewChallengeDay = (lastChallengeDate: string | null): boolean => {
  if (!lastChallengeDate) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastChallengeDate);
  lastDate.setHours(0, 0, 0, 0);

  return today.getTime() > lastDate.getTime();
};

// Berechnet die Streak
export const calculateStreak = (
  completedDates: string[],
  currentStreak: number
): { newStreak: number; longestStreak: number } => {
  if (completedDates.length === 0) {
    return { newStreak: 0, longestStreak: currentStreak };
  }

  // Sort dates
  const sortedDates = [...completedDates].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastCompletedDate = new Date(sortedDates[0]);
  lastCompletedDate.setHours(0, 0, 0, 0);

  // Check if last completion was today or yesterday
  const timeDiff = today.getTime() - lastCompletedDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  let newStreak = currentStreak;

  if (daysDiff === 0) {
    // Completed today, streak continues
    newStreak = currentStreak + 1;
  } else if (daysDiff === 1) {
    // Completed yesterday, streak continues from there
    newStreak = currentStreak;
  } else {
    // Streak broken
    newStreak = 1;
  }

  return {
    newStreak,
    longestStreak: Math.max(newStreak, currentStreak),
  };
};

// Gibt heute als ISO-String zurück
export const getTodayISO = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Punkte für Schwierigkeit
export const getPointsForDifficulty = (difficulty: Difficulty): number => {
  return PointsPerDifficulty[difficulty] || 5;
};
