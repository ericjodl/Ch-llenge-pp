import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Challenge } from '../types';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: () => void;
  onSkip: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onComplete,
  onSkip,
}) => {
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe right = complete
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe left = skip
          swipeLeft();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const swipeRight = () => {
    Animated.parallel([
      Animated.timing(position.x, {
        toValue: SCREEN_WIDTH + 100,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onComplete();
      resetCard();
    });
  };

  const swipeLeft = () => {
    Animated.parallel([
      Animated.timing(position.x, {
        toValue: -SCREEN_WIDTH - 100,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onSkip();
      resetCard();
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 5,
    }).start();
  };

  const resetCard = () => {
    position.setValue({ x: 0, y: 0 });
    opacity.setValue(1);
  };

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const completeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const skipOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const categoryColor = Colors[challenge.category];
  const difficultyColor = Colors[challenge.difficulty];

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        {
          transform: [{ translateX: position.x }, { rotate }],
          opacity,
        },
      ]}
    >
      {/* Complete indicator */}
      <Animated.View style={[styles.indicator, styles.completeIndicator, { opacity: completeOpacity }]}>
        <Text style={styles.indicatorText}>ERLEDIGT!</Text>
      </Animated.View>

      {/* Skip indicator */}
      <Animated.View style={[styles.indicator, styles.skipIndicator, { opacity: skipOpacity }]}>
        <Text style={styles.indicatorText}>SKIP</Text>
      </Animated.View>

      {/* Emoji */}
      <Text style={styles.emoji}>{challenge.emoji}</Text>

      {/* Category badge */}
      <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
        <Text style={styles.categoryText}>
          {CategoryEmojis[challenge.category]} {CategoryNames[challenge.category]}
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{challenge.title}</Text>

      {/* Description */}
      <Text style={styles.description}>{challenge.description}</Text>

      {/* Tips */}
      {challenge.tips && challenge.tips.length > 0 && (
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tipps:</Text>
          {challenge.tips.map((tip, index) => (
            <Text key={index} style={styles.tipText}>
              • {tip}
            </Text>
          ))}
        </View>
      )}

      {/* Difficulty & Points */}
      <View style={styles.footer}>
        <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
          <Text style={styles.difficultyText}>{DifficultyLabels[challenge.difficulty]}</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>+{challenge.points} Punkte</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={onSkip}
        >
          <Text style={styles.buttonText}>Überspringen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={onComplete}
        >
          <Text style={styles.buttonTextWhite}>Erledigt!</Text>
        </TouchableOpacity>
      </View>

      {/* Swipe hint */}
      <Text style={styles.swipeHint}>
        Swipe rechts = Erledigt • Swipe links = Überspringen
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    ...Shadows.lg,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    zIndex: 10,
  },
  completeIndicator: {
    right: Spacing.lg,
    backgroundColor: Colors.success,
  },
  skipIndicator: {
    left: Spacing.lg,
    backgroundColor: Colors.error,
  },
  indicatorText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  categoryText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.grayDark,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  tipsContainer: {
    backgroundColor: Colors.grayLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  tipsTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  tipText: {
    fontSize: FontSizes.sm,
    color: Colors.grayDark,
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  difficultyText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSizes.sm,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: Colors.grayLight,
  },
  completeButton: {
    backgroundColor: Colors.success,
  },
  buttonText: {
    color: Colors.grayDark,
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
  buttonTextWhite: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
  swipeHint: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default ChallengeCard;
