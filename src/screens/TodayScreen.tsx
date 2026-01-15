import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ChallengeCard, ProgressBar, ConfettiEffect, ConfettiRef } from '../components';
import {
  Colors,
  Spacing,
  BorderRadius,
  FontSizes,
  LevelConfig,
} from '../constants/theme';
import { getLevelTitle, getPointsForNextLevel } from '../utils/helpers';

export const TodayScreen: React.FC = () => {
  const { state, loading, getNewChallenge, completeChallenge, skipChallenge } = useApp();
  const confettiRef = useRef<ConfettiRef>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState<{ title: string; emoji: string } | null>(null);
  const previousAchievementsRef = useRef(state.unlockedAchievements.length);

  // Check for new achievements
  useEffect(() => {
    if (state.unlockedAchievements.length > previousAchievementsRef.current) {
      const newest = state.unlockedAchievements[state.unlockedAchievements.length - 1];
      setNewAchievement({ title: newest.title, emoji: newest.emoji });
      setShowAchievementModal(true);
      confettiRef.current?.fire();
    }
    previousAchievementsRef.current = state.unlockedAchievements.length;
  }, [state.unlockedAchievements.length]);

  const handleComplete = () => {
    confettiRef.current?.fire();
    completeChallenge();
  };

  const handleSkip = () => {
    skipChallenge();
    // Get new challenge after skipping
    setTimeout(() => getNewChallenge(), 300);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Lädt...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { stats } = state;
  const pointsToNextLevel = getPointsForNextLevel(stats.level);
  const currentLevelPoints = stats.totalPoints - (stats.level - 1) * LevelConfig.pointsPerLevel;
  const progress = currentLevelPoints / LevelConfig.pointsPerLevel;
  const levelTitle = getLevelTitle(stats.level);

  return (
    <SafeAreaView style={styles.container}>
      <ConfettiEffect ref={confettiRef} />

      {/* Achievement Modal */}
      <Modal
        visible={showAchievementModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAchievementModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>{newAchievement?.emoji}</Text>
            <Text style={styles.modalTitle}>Neues Abzeichen!</Text>
            <Text style={styles.modalAchievement}>{newAchievement?.title}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowAchievementModal(false)}
            >
              <Text style={styles.modalButtonText}>Super!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hallo! 👋</Text>
          <Text style={styles.subtitle}>Deine heutige Challenge wartet!</Text>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalPoints}</Text>
            <Text style={styles.statLabel}>Punkte</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🔥 {stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Lv. {stats.level}</Text>
            <Text style={styles.statLabel}>{levelTitle}</Text>
          </View>
        </View>

        {/* Progress to next level */}
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            label={`${currentLevelPoints}/${LevelConfig.pointsPerLevel} Punkte zum nächsten Level`}
            color={Colors.primary}
          />
        </View>

        {/* Challenge Card */}
        {state.currentChallenge ? (
          <ChallengeCard
            challenge={state.currentChallenge}
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        ) : (
          <View style={styles.noChallenge}>
            <Text style={styles.noChallengeEmoji}>🎉</Text>
            <Text style={styles.noChallengeTitle}>Challenge erledigt!</Text>
            <Text style={styles.noChallengeText}>
              Du hast deine Challenge für heute abgeschlossen. Komm morgen wieder für eine neue!
            </Text>
            <TouchableOpacity
              style={styles.newChallengeButton}
              onPress={getNewChallenge}
            >
              <Text style={styles.newChallengeButtonText}>
                Noch eine Challenge!
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <Text style={styles.quickStatsTitle}>Deine Statistik</Text>
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatEmoji}>✅</Text>
              <Text style={styles.quickStatValue}>{stats.totalCompleted}</Text>
              <Text style={styles.quickStatLabel}>Erledigt</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatEmoji}>⏭️</Text>
              <Text style={styles.quickStatValue}>{stats.totalSkipped}</Text>
              <Text style={styles.quickStatLabel}>Übersprungen</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatEmoji}>🏆</Text>
              <Text style={styles.quickStatValue}>{stats.longestStreak}</Text>
              <Text style={styles.quickStatLabel}>Beste Streak</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.grayDark,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  greeting: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.black,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.grayDark,
    marginTop: Spacing.xs,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.grayLight,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.black,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.grayDark,
    marginTop: Spacing.xs,
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  noChallenge: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  noChallengeEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  noChallengeTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  noChallengeText: {
    fontSize: FontSizes.md,
    color: Colors.grayDark,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  newChallengeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  newChallengeButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
  quickStats: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  quickStatsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  quickStatValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.black,
  },
  quickStatLabel: {
    fontSize: FontSizes.xs,
    color: Colors.grayDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
  },
  modalEmoji: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  modalAchievement: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  modalButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
});

export default TodayScreen;
