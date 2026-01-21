import {
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subWeeks,
  subMonths,
  getDay,
  getHours,
  eachDayOfInterval,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import * as Crypto from 'expo-crypto';

// UUID生成
export const generateUUID = (): string => {
  return Crypto.randomUUID();
};

// 日付フォーマット
export const formatDate = (dateString: string, formatStr: string = 'yyyy/MM/dd'): string => {
  return format(parseISO(dateString), formatStr, { locale: ja });
};

export const formatDateTime = (dateString: string): string => {
  return format(parseISO(dateString), 'yyyy/MM/dd HH:mm', { locale: ja });
};

export const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'HH:mm', { locale: ja });
};

// 現在日時をISO文字列で取得
export const nowISO = (): string => {
  return new Date().toISOString();
};

// 期間内かどうかチェック
export const isWithinPeriod = (
  startDate: string | undefined,
  endDate: string | undefined
): boolean => {
  if (!startDate || !endDate) return true;

  const now = new Date();
  return isWithinInterval(now, {
    start: startOfDay(parseISO(startDate)),
    end: endOfDay(parseISO(endDate)),
  });
};

// 期間フィルター用のヘルパー
export type DateRange = 'week' | 'month' | 'all';

export const getDateRange = (range: DateRange): { start: Date; end: Date } | null => {
  const now = new Date();

  switch (range) {
    case 'week':
      return {
        start: startOfWeek(now, { locale: ja }),
        end: endOfWeek(now, { locale: ja }),
      };
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case 'all':
      return null;
  }
};

// 過去N日間の日付配列を取得
export const getPastDays = (days: number): string[] => {
  const end = new Date();
  const start = subDays(end, days - 1);

  return eachDayOfInterval({ start, end }).map((date) => format(date, 'yyyy-MM-dd'));
};

// 曜日名を取得
export const getWeekdayName = (weekday: number): string => {
  const names = ['日', '月', '火', '水', '木', '金', '土'];
  return names[weekday];
};

// 日付から曜日番号を取得 (0=日曜)
export const getWeekday = (dateString: string): number => {
  return getDay(parseISO(dateString));
};

// 日付から時間を取得
export const getHour = (dateString: string): number => {
  return getHours(parseISO(dateString));
};

// 相対的な日付表示
export const getRelativeDate = (dateString: string): string => {
  const date = parseISO(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '昨日';
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
  return formatDate(dateString);
};

// 継続日数を計算（作成日または最後の違反日から）
export const getStreakDays = (
  createdAt: string,
  lastViolationAt?: string
): number => {
  const now = startOfDay(new Date());
  const startDate = lastViolationAt
    ? startOfDay(parseISO(lastViolationAt))
    : startOfDay(parseISO(createdAt));

  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};
