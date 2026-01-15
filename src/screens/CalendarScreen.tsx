import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useApp } from '../context/AppContext';
import { challenges } from '../data/challenges';
import {
  Colors,
  CategoryEmojis,
  CategoryNames,
  DifficultyLabels,
  Spacing,
  BorderRadius,
  FontSizes,
  Shadows,
} from '../constants/theme';

export const CalendarScreen: React.FC = () => {
  const { state } = useApp();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Create marked dates for calendar
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    state.completedChallenges.forEach((completed) => {
      const date = completed.date.split('T')[0];

      if (completed.status === 'completed') {
        marks[date] = {
          marked: true,
          dotColor: Colors.success,
          selected: selectedDate === date,
          selectedColor: Colors.primary,
        };
      } else if (completed.status === 'skipped') {
        marks[date] = {
          marked: true,
          dotColor: Colors.warning,
          selected: selectedDate === date,
          selectedColor: Colors.primary,
        };
      }
    });

    // Mark selected date if not already marked
    if (selectedDate && !marks[selectedDate]) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: Colors.primary,
      };
    }

    return marks;
  }, [state.completedChallenges, selectedDate]);

  // Get challenges for selected date
  const challengesForDate = useMemo(() => {
    if (!selectedDate) return [];

    return state.completedChallenges
      .filter((c) => c.date.startsWith(selectedDate))
      .map((completed) => {
        const challenge = challenges.find((ch) => ch.id === completed.challengeId);
        return {
          ...completed,
          challenge,
        };
      });
  }, [selectedDate, state.completedChallenges]);

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM

    const monthChallenges = state.completedChallenges.filter((c) =>
      c.date.startsWith(currentMonth)
    );

    const completed = monthChallenges.filter((c) => c.status === 'completed').length;
    const skipped = monthChallenges.filter((c) => c.status === 'skipped').length;
    const totalPoints = monthChallenges.reduce((sum, c) => sum + c.pointsEarned, 0);

    return { completed, skipped, totalPoints };
  }, [state.completedChallenges]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Kalender</Text>
          <Text style={styles.subtitle}>Dein Challenge-Verlauf</Text>
        </View>

        {/* Monthly Stats */}
        <View style={styles.monthlyStats}>
          <Text style={styles.monthlyTitle}>Diesen Monat</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statValue}>{monthlyStats.completed}</Text>
              <Text style={styles.statLabel}>Erledigt</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⏭️</Text>
              <Text style={styles.statValue}>{monthlyStats.skipped}</Text>
              <Text style={styles.statLabel}>Übersprungen</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statValue}>{monthlyStats.totalPoints}</Text>
              <Text style={styles.statLabel}>Punkte</Text>
            </View>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={{
              backgroundColor: Colors.white,
              calendarBackground: Colors.white,
              textSectionTitleColor: Colors.grayDark,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.white,
              todayTextColor: Colors.primary,
              dayTextColor: Colors.black,
              textDisabledColor: Colors.gray,
              dotColor: Colors.success,
              selectedDotColor: Colors.white,
              arrowColor: Colors.primary,
              monthTextColor: Colors.black,
              textMonthFontWeight: 'bold',
              textDayFontSize: FontSizes.md,
              textMonthFontSize: FontSizes.lg,
              textDayHeaderFontSize: FontSizes.sm,
            }}
            firstDay={1} // Monday first
          />
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.legendText}>Erledigt</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.legendText}>Übersprungen</Text>
          </View>
        </View>

        {/* Selected Date Details */}
        {selectedDate && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>
              {new Date(selectedDate).toLocaleDateString('de-DE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>

            {challengesForDate.length > 0 ? (
              challengesForDate.map((item, index) => (
                <View key={index} style={styles.challengeItem}>
                  <View style={styles.challengeHeader}>
                    <Text style={styles.challengeEmoji}>
                      {item.challenge?.emoji || '❓'}
                    </Text>
                    <View style={styles.challengeInfo}>
                      <Text style={styles.challengeTitle}>
                        {item.challenge?.title || 'Unbekannte Challenge'}
                      </Text>
                      {item.challenge && (
                        <View style={styles.challengeTags}>
                          <View
                            style={[
                              styles.categoryTag,
                              { backgroundColor: Colors[item.challenge.category] },
                            ]}
                          >
                            <Text style={styles.tagText}>
                              {CategoryEmojis[item.challenge.category]}{' '}
                              {CategoryNames[item.challenge.category]}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.challengeStatus}>
                    {item.status === 'completed' ? (
                      <>
                        <Text style={styles.completedText}>✅ Erledigt</Text>
                        <Text style={styles.pointsText}>+{item.pointsEarned} Punkte</Text>
                      </>
                    ) : (
                      <Text style={styles.skippedText}>⏭️ Übersprungen</Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noActivity}>
                <Text style={styles.noActivityEmoji}>📅</Text>
                <Text style={styles.noActivityText}>
                  Keine Aktivität an diesem Tag
                </Text>
              </View>
            )}
          </View>
        )}

        {/* All-time History Summary */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Gesamtübersicht</Text>
          <View style={styles.historyRow}>
            <View style={styles.historyItem}>
              <Text style={styles.historyValue}>{state.stats.totalCompleted}</Text>
              <Text style={styles.historyLabel}>Challenges erledigt</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyValue}>{state.stats.totalPoints}</Text>
              <Text style={styles.historyLabel}>Punkte gesammelt</Text>
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
  monthlyStats: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  monthlyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.black,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.grayDark,
  },
  calendarContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    padding: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.xs,
  },
  legendText: {
    fontSize: FontSizes.sm,
    color: Colors.grayDark,
  },
  detailsContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  detailsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  challengeItem: {
    backgroundColor: Colors.grayLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  challengeEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  challengeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  categoryTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    fontWeight: '600',
  },
  challengeStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedText: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: '600',
  },
  skippedText: {
    fontSize: FontSizes.sm,
    color: Colors.warning,
    fontWeight: '600',
  },
  pointsText: {
    fontSize: FontSizes.sm,
    color: Colors.accent,
    fontWeight: '600',
  },
  noActivity: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  noActivityEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  noActivityText: {
    fontSize: FontSizes.md,
    color: Colors.grayDark,
  },
  historyContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
    ...Shadows.sm,
  },
  historyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  historyItem: {
    alignItems: 'center',
  },
  historyValue: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  historyLabel: {
    fontSize: FontSizes.sm,
    color: Colors.grayDark,
    marginTop: Spacing.xs,
  },
});

export default CalendarScreen;
