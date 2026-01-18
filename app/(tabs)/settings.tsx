import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSettingsStore } from '../../stores/settingsStore';
import { Card } from '../../components/ui';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';
import { scheduleReminder, requestNotificationPermission } from '../../services/notifications';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useSettingsStore();
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 設定変更時に通知をスケジュール
  useEffect(() => {
    scheduleReminder(settings);
  }, [settings]);

  const handleReminderToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        Alert.alert(
          '通知の許可が必要です',
          '設定アプリから通知を許可してください'
        );
        return;
      }
    }
    await updateSettings({ reminderEnabled: value });
  };

  const handleFrequencyChange = async (frequency: 'daily' | 'weekly') => {
    await updateSettings({ reminderFrequency: frequency });
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      await updateSettings({ reminderTime: `${hours}:${minutes}` });
    }
  };

  const getTimeDate = () => {
    const [hours, minutes] = settings.reminderTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* カテゴリ管理 */}
      <Card style={styles.card}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/category/manage')}
        >
          <View>
            <Text style={styles.menuTitle}>カテゴリ管理</Text>
            <Text style={styles.menuDescription}>カテゴリの追加・編集・削除</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </Card>

      {/* 通知設定 */}
      <Text style={styles.sectionTitle}>通知設定</Text>
      <Card style={styles.card}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>リマインダー</Text>
            <Text style={styles.settingDescription}>
              やらないことを定期的に振り返る
            </Text>
          </View>
          <Switch
            value={settings.reminderEnabled}
            onValueChange={handleReminderToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>

        {settings.reminderEnabled && (
          <>
            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>頻度</Text>
              <View style={styles.frequencyButtons}>
                <TouchableOpacity
                  style={[
                    styles.frequencyButton,
                    settings.reminderFrequency === 'daily' && styles.frequencyButtonActive,
                  ]}
                  onPress={() => handleFrequencyChange('daily')}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      settings.reminderFrequency === 'daily' &&
                        styles.frequencyButtonTextActive,
                    ]}
                  >
                    毎日
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.frequencyButton,
                    settings.reminderFrequency === 'weekly' && styles.frequencyButtonActive,
                  ]}
                  onPress={() => handleFrequencyChange('weekly')}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      settings.reminderFrequency === 'weekly' &&
                        styles.frequencyButtonTextActive,
                    ]}
                  >
                    週1回
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.settingLabel}>時刻</Text>
              <Text style={styles.timeValue}>{settings.reminderTime}</Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={getTimeDate()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </>
        )}
      </Card>

      {/* アプリ情報 */}
      <Text style={styles.sectionTitle}>アプリ情報</Text>
      <Card style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>バージョン</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </Card>
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
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    marginBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  menuArrow: {
    fontSize: fontSize.xl,
    color: colors.textTertiary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  settingDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  frequencyButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  frequencyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  frequencyButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  frequencyButtonTextActive: {
    color: colors.surface,
  },
  timeValue: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
