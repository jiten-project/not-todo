import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { NotTodoItemWithCount } from '../types';
import { Card, Badge } from './ui';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../constants/theme';
import { formatDate, isWithinPeriod } from '../utils/dateUtils';

interface NotTodoItemProps {
  item: NotTodoItemWithCount;
  onPress: () => void;
  onViolationPress: () => void;
}

export const NotTodoItemComponent: React.FC<NotTodoItemProps> = ({
  item,
  onPress,
  onViolationPress,
}) => {
  const isActive = item.isActive && isWithinPeriod(item.startDate, item.endDate);
  const categoryColor = item.category?.color || colors.textTertiary;

  const cardStyle: ViewStyle = {
    ...styles.card,
    ...(isActive ? {} : styles.inactive),
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={cardStyle}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
            <Text style={[styles.title, !isActive && styles.inactiveText]} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
          {item.violationCount > 0 && (
            <TouchableOpacity onPress={onViolationPress} style={styles.violationBadge}>
              <Text style={styles.violationCount}>{item.violationCount}</Text>
            </TouchableOpacity>
          )}
        </View>

        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Badge
            label={item.category?.name || '未分類'}
            color={categoryColor}
            size="small"
          />
          {item.durationType === 'temporary' && item.endDate && (
            <Text style={styles.period}>〜 {formatDate(item.endDate)}</Text>
          )}
          {!isActive && (
            <Badge label="非アクティブ" color={colors.textTertiary} size="small" />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  inactive: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  inactiveText: {
    color: colors.textSecondary,
  },
  violationBadge: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  violationCount: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  period: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
});
