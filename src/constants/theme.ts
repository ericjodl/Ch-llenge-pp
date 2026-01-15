import { ChallengeCategory } from '../types';

// Hauptfarben der App
export const Colors = {
  // Primärfarben
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryDark: '#E55555',

  // Sekundärfarben
  secondary: '#4ECDC4',
  secondaryLight: '#7EDDD6',
  secondaryDark: '#3DBDB5',

  // Akzentfarben
  accent: '#FFE66D',
  accentLight: '#FFED9E',
  accentDark: '#E6CF5C',

  // Kategoriefarben
  kreativ: '#9B59B6',
  sportlich: '#E74C3C',
  lustig: '#F39C12',
  sozial: '#3498DB',
  experiment: '#1ABC9C',

  // Schwierigkeitsfarben
  leicht: '#2ECC71',
  mittel: '#F39C12',
  schwer: '#E74C3C',

  // Neutral
  white: '#FFFFFF',
  black: '#2C3E50',
  gray: '#95A5A6',
  grayLight: '#ECF0F1',
  grayDark: '#7F8C8D',

  // Status
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',

  // Hintergrund
  background: '#F8F9FA',
  card: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Kategorie-Emojis
export const CategoryEmojis: Record<ChallengeCategory, string> = {
  kreativ: '🎨',
  sportlich: '💪',
  lustig: '😂',
  sozial: '❤️',
  experiment: '🔬',
};

// Kategorie-Namen (deutsch)
export const CategoryNames: Record<ChallengeCategory, string> = {
  kreativ: 'Kreativ',
  sportlich: 'Sportlich',
  lustig: 'Lustig',
  sozial: 'Sozial',
  experiment: 'Experiment',
};

// Schwierigkeits-Labels
export const DifficultyLabels: Record<string, string> = {
  leicht: 'Leicht',
  mittel: 'Mittel',
  schwer: 'Schwer',
};

// Punkte pro Schwierigkeit
export const PointsPerDifficulty: Record<string, number> = {
  leicht: 5,
  mittel: 10,
  schwer: 20,
};

// Level-Konfiguration
export const LevelConfig = {
  pointsPerLevel: 100,
  maxLevel: 50,
  levelTitles: [
    'Anfänger',
    'Entdecker',
    'Herausforderer',
    'Champion',
    'Meister',
    'Legende',
    'Superstar',
    'Held',
    'Ikone',
    'Unsterblich',
  ],
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Font Sizes
export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  huge: 48,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};
