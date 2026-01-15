import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Achievement } from '../types';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  onPress?: () => void;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  unlocked,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        unlocked ? styles.unlocked : styles.locked,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[styles.emoji, !unlocked && styles.lockedEmoji]}>
        {unlocked ? achievement.emoji : '🔒'}
      </Text>
      <Text style={[styles.title, !unlocked && styles.lockedText]}>
        {achievement.title}
      </Text>
      <Text style={[styles.description, !unlocked && styles.lockedText]}>
        {achievement.description}
      </Text>
      {unlocked && achievement.unlockedAt && (
        <Text style={styles.unlockedDate}>
          Freigeschaltet am {new Date(achievement.unlockedAt).toLocaleDateString('de-DE')}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    width: '45%',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  unlocked: {
    backgroundColor: Colors.white,
  },
  locked: {
    backgroundColor: Colors.grayLight,
    opacity: 0.7,
  },
  emoji: {
    fontSize: 40,
    marginBottom: Spacing.xs,
  },
  lockedEmoji: {
    opacity: 0.5,
  },
  title: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSizes.xs,
    color: Colors.grayDark,
    textAlign: 'center',
  },
  lockedText: {
    color: Colors.gray,
  },
  unlockedDate: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    marginTop: Spacing.xs,
  },
});

export default AchievementBadge;
