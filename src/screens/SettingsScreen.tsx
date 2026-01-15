import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { CategorySelector } from '../components';
import { Difficulty, ChallengeCategory } from '../types';
import {
  Colors,
  DifficultyLabels,
  Spacing,
  BorderRadius,
  FontSizes,
  Shadows,
} from '../constants/theme';

export const SettingsScreen: React.FC = () => {
  const { state, updateSettings, resetState } = useApp();
  const { settings } = state;

  const handleCategoryChange = (categories: ChallengeCategory[]) => {
    updateSettings({ favoriteCategories: categories });
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    updateSettings({ preferredDifficulty: difficulty });
  };

  const handleNotificationToggle = (value: boolean) => {
    updateSettings({ notificationsEnabled: value });
  };

  const handleReset = () => {
    Alert.alert(
      'Fortschritt zurücksetzen',
      'Bist du sicher? Alle Punkte, Achievements und der Verlauf werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Zurücksetzen',
          style: 'destructive',
          onPress: () => {
            resetState();
            Alert.alert('Zurückgesetzt', 'Dein Fortschritt wurde zurückgesetzt.');
          },
        },
      ]
    );
  };

  const difficulties: Difficulty[] = ['leicht', 'mittel', 'schwer'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Einstellungen</Text>
          <Text style={styles.subtitle}>Passe die App an deine Vorlieben an</Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favoriten-Kategorien</Text>
          <Text style={styles.sectionDescription}>
            Wähle die Kategorien, aus denen du Challenges erhalten möchtest
          </Text>
          <View style={styles.card}>
            <CategorySelector
              selected={settings.favoriteCategories}
              onChange={handleCategoryChange}
            />
          </View>
        </View>

        {/* Difficulty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bevorzugte Schwierigkeit</Text>
          <Text style={styles.sectionDescription}>
            Challenges dieser Schwierigkeit werden häufiger angezeigt
          </Text>
          <View style={styles.card}>
            <View style={styles.difficultyContainer}>
              {difficulties.map((difficulty) => {
                const isSelected = settings.preferredDifficulty === difficulty;
                return (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.difficultyButton,
                      isSelected && {
                        backgroundColor: Colors[difficulty],
                      },
                    ]}
                    onPress={() => handleDifficultyChange(difficulty)}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        isSelected && styles.difficultyTextSelected,
                      ]}
                    >
                      {DifficultyLabels[difficulty]}
                    </Text>
                    <Text style={styles.difficultyPoints}>
                      {difficulty === 'leicht' && '+5 Punkte'}
                      {difficulty === 'mittel' && '+10 Punkte'}
                      {difficulty === 'schwer' && '+20 Punkte'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benachrichtigungen</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>Push-Benachrichtigungen</Text>
                <Text style={styles.switchDescription}>
                  Erhalte täglich eine Erinnerung für deine Challenge
                </Text>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: Colors.gray, true: Colors.primaryLight }}
                thumbColor={settings.notificationsEnabled ? Colors.primary : Colors.grayLight}
              />
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deine Statistik</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Gesamt-Punkte</Text>
              <Text style={styles.statValue}>{state.stats.totalPoints}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>{state.stats.level}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Challenges erledigt</Text>
              <Text style={styles.statValue}>{state.stats.totalCompleted}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Aktuelle Streak</Text>
              <Text style={styles.statValue}>{state.stats.currentStreak} Tage</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Längste Streak</Text>
              <Text style={styles.statValue}>{state.stats.longestStreak} Tage</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Abzeichen freigeschaltet</Text>
              <Text style={styles.statValue}>{state.unlockedAchievements.length}</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Über die App</Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>App-Name</Text>
              <Text style={styles.aboutValue}>ChällengeÄpp</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Slogan</Text>
              <Text style={styles.aboutValue}>
                Jeden Tag eine kleine Challenge – Spaß garantiert!
              </Text>
            </View>
          </View>
        </View>

        {/* Reset */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gefahrenzone</Text>
          <View style={[styles.card, styles.dangerCard]}>
            <Text style={styles.dangerTitle}>Fortschritt zurücksetzen</Text>
            <Text style={styles.dangerDescription}>
              Löscht alle Punkte, Achievements, und den gesamten Verlauf. Diese Aktion
              kann nicht rückgängig gemacht werden.
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Zurücksetzen</Text>
            </TouchableOpacity>
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
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.grayDark,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  difficultyContainer: {
    gap: Spacing.sm,
  },
  difficultyButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.grayLight,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  difficultyText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
  },
  difficultyTextSelected: {
    color: Colors.white,
  },
  difficultyPoints: {
    fontSize: FontSizes.sm,
    color: Colors.grayDark,
    marginTop: Spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  switchLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
  },
  switchDescription: {
    fontSize: FontSizes.sm,
    color: Colors.grayDark,
    marginTop: Spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  statDivider: {
    height: 1,
    backgroundColor: Colors.grayLight,
  },
  statLabel: {
    fontSize: FontSizes.md,
    color: Colors.grayDark,
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
  },
  aboutRow: {
    paddingVertical: Spacing.sm,
  },
  aboutLabel: {
    fontSize: FontSizes.sm,
    color: Colors.grayDark,
  },
  aboutValue: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
    marginTop: Spacing.xs,
  },
  dangerCard: {
    borderWidth: 2,
    borderColor: Colors.error,
  },
  dangerTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  dangerDescription: {
    fontSize: FontSizes.sm,
    color: Colors.grayDark,
    marginBottom: Spacing.md,
  },
  resetButton: {
    backgroundColor: Colors.error,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  resetButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});

export default SettingsScreen;
