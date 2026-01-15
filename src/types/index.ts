// Challenge-Kategorien
export type ChallengeCategory =
  | 'kreativ'
  | 'sportlich'
  | 'lustig'
  | 'sozial'
  | 'experiment';

// Schwierigkeitsgrade
export type Difficulty = 'leicht' | 'mittel' | 'schwer';

// Challenge-Status
export type ChallengeStatus = 'pending' | 'completed' | 'skipped';

// Challenge Interface
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  points: number;
  emoji: string;
  tips?: string[];
}

// Erledigte Challenge mit Datum
export interface CompletedChallenge {
  challengeId: string;
  date: string; // ISO date string
  status: ChallengeStatus;
  pointsEarned: number;
}

// Achievement/Abzeichen
export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  requirement: number;
  type: 'streak' | 'total' | 'category';
  category?: ChallengeCategory;
  unlockedAt?: string;
}

// Benutzer-Statistiken
export interface UserStats {
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  totalSkipped: number;
  categoryStats: Record<ChallengeCategory, number>;
}

// Benutzer-Einstellungen
export interface UserSettings {
  favoriteCategories: ChallengeCategory[];
  preferredDifficulty: Difficulty;
  notificationsEnabled: boolean;
  notificationTime: string; // HH:mm format
  theme: 'light' | 'dark' | 'auto';
}

// App-State
export interface AppState {
  currentChallenge: Challenge | null;
  completedChallenges: CompletedChallenge[];
  unlockedAchievements: Achievement[];
  stats: UserStats;
  settings: UserSettings;
  seenChallengeIds: string[];
  lastChallengeDate: string | null;
}
