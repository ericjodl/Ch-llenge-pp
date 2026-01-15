import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';

interface StatsCardProps {
  title: string;
  value: string | number;
  emoji: string;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  emoji,
  color = Colors.primary,
}) => {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    ...Shadows.sm,
    marginBottom: Spacing.sm,
  },
  emoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.black,
  },
  title: {
    fontSize: FontSizes.sm,
    color: Colors.grayDark,
  },
});

export default StatsCard;
