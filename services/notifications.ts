import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Settings } from '../types';

// 通知の表示設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 通知許可を取得
export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// リマインダー通知をスケジュール
export const scheduleReminder = async (settings: Settings): Promise<void> => {
  // 既存の通知をキャンセル
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!settings.reminderEnabled) {
    return;
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return;
  }

  const [hours, minutes] = settings.reminderTime.split(':').map(Number);

  if (settings.reminderFrequency === 'daily') {
    // 毎日の通知
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'やらないことリスト',
        body: '今日も「やらないこと」を意識して過ごしましょう',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });
  } else {
    // 週1回（月曜日）の通知
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'やらないことリスト',
        body: '今週の「やらないこと」を振り返りましょう',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 2, // 月曜日
        hour: hours,
        minute: minutes,
      },
    });
  }
};

// すべての予定通知をキャンセル
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// 予定されている通知を取得
export const getScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};
