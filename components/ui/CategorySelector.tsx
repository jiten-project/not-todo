import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Category } from '../../types';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';

interface CategorySelectorProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddCategory?: () => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedId,
  onSelect,
  onAddCategory,
}) => {
  return (
    <View style={styles.container}>
      {categories.map((cat) => {
        const isActive = selectedId === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.button,
              isActive && styles.buttonActive,
              { borderColor: cat.color },
            ]}
            onPress={() => onSelect(cat.id)}
          >
            <View style={[styles.dot, { backgroundColor: cat.color }]} />
            <Text style={[styles.text, isActive && styles.textActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
      {onAddCategory && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddCategory}
        >
          <Text style={styles.addButtonText}>＋ 追加</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    backgroundColor: colors.surface,
  },
  buttonActive: {
    backgroundColor: colors.surfaceSecondary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
  },
  addButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
