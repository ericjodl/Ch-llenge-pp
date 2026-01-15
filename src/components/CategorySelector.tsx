import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChallengeCategory } from '../types';
import {
  Colors,
  CategoryEmojis,
  CategoryNames,
  Spacing,
  BorderRadius,
  FontSizes,
} from '../constants/theme';

interface CategorySelectorProps {
  selected: ChallengeCategory[];
  onChange: (categories: ChallengeCategory[]) => void;
}

const ALL_CATEGORIES: ChallengeCategory[] = [
  'kreativ',
  'sportlich',
  'lustig',
  'sozial',
  'experiment',
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selected,
  onChange,
}) => {
  const toggleCategory = (category: ChallengeCategory) => {
    if (selected.includes(category)) {
      // Don't allow deselecting all categories
      if (selected.length > 1) {
        onChange(selected.filter((c) => c !== category));
      }
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <View style={styles.container}>
      {ALL_CATEGORIES.map((category) => {
        const isSelected = selected.includes(category);
        const color = Colors[category];

        return (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              isSelected && { backgroundColor: color },
              !isSelected && styles.unselected,
            ]}
            onPress={() => toggleCategory(category)}
          >
            <Text style={styles.emoji}>{CategoryEmojis[category]}</Text>
            <Text
              style={[
                styles.categoryText,
                isSelected ? styles.selectedText : styles.unselectedText,
              ]}
            >
              {CategoryNames[category]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  unselected: {
    backgroundColor: Colors.grayLight,
    borderColor: Colors.gray,
  },
  emoji: {
    fontSize: FontSizes.lg,
    marginRight: Spacing.xs,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  selectedText: {
    color: Colors.white,
  },
  unselectedText: {
    color: Colors.grayDark,
  },
});

export default CategorySelector;
