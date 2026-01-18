import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useNotTodoStore } from '../../stores/notTodoStore';
import { Card, EmptyState } from '../../components/ui';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';
import { getWeekdayName, formatDate } from '../../utils/dateUtils';

const screenWidth = Dimensions.get('window').width;

type PeriodFilter = 7 | 14 | 30;

export default function StatsScreen() {
  const { stats, loadStats } = useNotTodoStore();
  const [period, setPeriod] = useState<PeriodFilter>(7);

  useFocusEffect(
    useCallback(() => {
      loadStats(period);
    }, [period])
  );

  if (!stats || stats.totalViolations === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="📊"
          title="まだデータがありません"
          description="違反を記録すると統計が表示されます"
        />
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(45, 45, 45, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: { borderRadius: borderRadius.lg },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.borderLight,
    },
  };

  // トレンドデータを期間でフィルタ
  const trendData = stats.trend.slice(-period);
  const trendLabels = trendData
    .filter((_, i) => i % Math.ceil(period / 7) === 0)
    .map((d) => formatDate(d.date, 'M/d'));
  const trendValues = trendData.map((d) => d.count);

  // 曜日別データ
  const weekdayLabels = stats.byWeekday.map((d) => getWeekdayName(d.weekday));
  const weekdayValues = stats.byWeekday.map((d) => d.count);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 期間選択 */}
      <View style={styles.periodSelector}>
        {([7, 14, 30] as PeriodFilter[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodButton, period === p && styles.periodButtonActive]}
            onPress={() => setPeriod(p)}
          >
            <Text
              style={[styles.periodButtonText, period === p && styles.periodButtonTextActive]}
            >
              {p}日間
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 概要 */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>期間内の違反回数</Text>
        <Text style={styles.summaryValue}>{stats.totalViolations}</Text>
      </Card>

      {/* カテゴリ別 */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>カテゴリ別違反</Text>
        {stats.byCategory.slice(0, 5).map((cat) => (
          <View key={cat.categoryId} style={styles.categoryRow}>
            <View style={styles.categoryInfo}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryName}>{cat.categoryName}</Text>
            </View>
            <View style={styles.categoryBar}>
              <View
                style={[
                  styles.categoryBarFill,
                  {
                    backgroundColor: cat.color,
                    width: `${(cat.count / stats.totalViolations) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.categoryCount}>{cat.count}</Text>
          </View>
        ))}
      </Card>

      {/* トレンド */}
      {trendValues.some((v) => v > 0) && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>違反トレンド</Text>
          <LineChart
            data={{
              labels: trendLabels,
              datasets: [{ data: trendValues.length > 0 ? trendValues : [0] }],
            }}
            width={screenWidth - spacing.md * 4}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={false}
            withInnerLines={false}
          />
        </Card>
      )}

      {/* 曜日別 */}
      {weekdayValues.some((v) => v > 0) && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>曜日別傾向</Text>
          <BarChart
            data={{
              labels: weekdayLabels,
              datasets: [{ data: weekdayValues }],
            }}
            width={screenWidth - spacing.md * 4}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
          />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  periodButtonTextActive: {
    color: colors.surface,
  },
  summaryCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  categoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  categoryCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    width: 30,
    textAlign: 'right',
  },
  chart: {
    marginLeft: -spacing.md,
    borderRadius: borderRadius.lg,
  },
});
