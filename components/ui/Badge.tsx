import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = colors.primary,
  size = 'small',
  style,
}) => {
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }, styles[size], style]}>
      <Text style={[styles.text, { color }, styles[`${size}Text`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  small: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
  },
  medium: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  text: {
    fontWeight: fontWeight.medium,
  },
  smallText: {
    fontSize: fontSize.xs,
  },
  mediumText: {
    fontSize: fontSize.sm,
  },
});
