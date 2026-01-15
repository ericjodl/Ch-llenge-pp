import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { achievements as allAchievements } from '../data/achievements';
import { AchievementBadge, ProgressBar, StatsCard } from '../components';
import {
  Colors,
  CategoryEmojis,
  CategoryNames,
  Spacing,
  BorderRadius,
  FontSizes,
  LevelConfig,
  Shadows,
} from '../constants/theme';
import { getLevelTitle, getPointsForNextLevel } from '../utils/helpers';

export const AchievementsScreen: React.FC = () => {
  const { state } = useApp();
  const { stats, unlockedAchievements } = state;

  const unlockedIds = useMemo(
    () => unlockedAchievements.map((a) => a.id),
    [unlockedAchievements]
  );

  // Group achievements by type
  const groupedAchievements = useMemo(() => {
    const groups: Record<string, typeof allAchievements> = {
      streak: [],
      total: [],
      category: [],
    };

    allAchievements.forEach((achievement) => {
      groups[achievement.type].push(achievement);
    });

    return groups;
  }, []);

  const levelTitle = getLevelTitle(stats.level);
  const currentLevelPoints = stats.totalPoints - (stats.level - 1) * LevelConfig.pointsPerLevel;
  const progress = currentLevelPoints / LevelConfig.pointsPerLevel;

  const unlockedCount = unlockedAchievements.length;
  const totalCount = allAchievements.length;
  const achievementProgress = unlockedCount / totalCount;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>Deine Erfolge und Abzeichen</Text>
        </View>

        {/* Level Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelEmoji}>⭐</Text>
            <View style={styles.levelInfo}>
              <Text style={styles.levelNumber}>Level {stats.level}</Text>
              <Text style={styles.levelTitle}>{levelTitle}</Text>
            </View>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>{stats.totalPoints} Punkte</Text>
            </View>
          </View>
          <View style={styles.levelProgress}>
            <ProgressBar
              progress={progress}
              label={`${currentLevelPoints}/${LevelConfig.pointsPerLevel} zum nächsten Level`}
              color={Colors.accent}
              height={16}
            />
          </View>
        </View>

        {/* Achievement Progress */}
        <View style={styles.achievementProgress}>
          <Text style={styles.sectionTitle}>Fortschritt</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressEmoji}>🏆</Text>
              <Text style={styles.progressText}>
                {unlockedCount} von {totalCount} Abzeichen
              </Text>
            </View>
            <ProgressBar
              progress={achievementProgress}
              showPercentage={true}
              color={Colors.primary}
            />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistiken</Text>
          <StatsCard
            title="Aktuelle Streak"
            value={`${stats.currentStreak} Tage`}
            emoji="🔥"
            color={Colors.error}
          />
          <StatsCard
            title="Längste Streak"
            value={`${stats.longestStreak} Tage`}
            emoji="📈"
            color={Colors.success}
          />
          <StatsCard
            title="Challenges erledigt"
            value={stats.totalCompleted}
            emoji="✅"
            color={Colors.secondary}
          />
        </View>

        {/* Category Stats */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Kategorien</Text>
          <View style={styles.categoryGrid}>
            {Object.entries(stats.categoryStats).map(([category, count]) => (
              <View
                key={category}
                style={[
                  styles.categoryCard,
                  { borderLeftColor: Colors[category as keyof typeof Colors] },
                ]}
              >
                <Text style={styles.categoryEmoji}>
                  {CategoryEmojis[category as keyof typeof CategoryEmojis]}
                </Text>
                <Text style={styles.categoryName}>
                  {CategoryNames[category as keyof typeof CategoryNames]}
                </Text>
                <Text style={styles.categoryCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Streak Achievements */}
        <View style={styles.achievementSection}>
          <Text style={styles.sectionTitle}>🔥 Streak-Abzeichen</Text>
          <View style={styles.achievementGrid}>
            {groupedAchievements.streak.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={unlockedIds.includes(achievement.id)}
              />
            ))}
          </View>
        </View>

        {/* Total Achievements */}
        <View style={styles.achievementSection}>
          <Text style={styles.sectionTitle}>📊 Meilenstein-Abzeichen</Text>
          <View style={styles.achievementGrid}>
            {groupedAchievements.total.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={unlockedIds.includes(achievement.id)}
              />
            ))}
          </View>
        </View>

        {/* Category Achievements */}
        <View style={styles.achievementSection}>
          <Text style={styles.sectionTitle}>🎯 Kategorie-Abzeichen</Text>
          <View style={styles.achievementGrid}>
            {groupedAchievements.category.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={unlockedIds.includes(achievement.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.black,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.grayDark,
    marginTop: Spacing.xs,
  },
  levelCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  levelEmoji: {
    fontSize: 48,
    marginRight: Spacing.md,
  },
  levelInfo: {
    flex: 1,
  },
  levelNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.white,
  },
  levelTitle: {
    fontSize: FontSizes.md,
    color: Colors.white,
    opacity: 0.9,
  },
  pointsBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  pointsText: {
    color: Colors.black,
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
  levelProgress: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  achievementProgress: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressEmoji: {
    fontSize: 28,
    marginRight: Spacing.sm,
  },
  progressText: {
    fontSize: FontSizes.md,
    color: Colors.black,
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  categorySection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '48%',
    borderLeftWidth: 4,
    ...Shadows.sm,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  categoryName: {
    fontSize: FontSizes.sm,
    color: Colors.grayDark,
  },
  categoryCount: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.black,
  },
  achievementSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});

export default AchievementsScreen;
