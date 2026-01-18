import * as SQLite from 'expo-sqlite';
import { Category, NotTodoItem, Violation, Settings, NotTodoItemWithCount, ViolationStats } from '../types';
import { getWeekday, getHour, getPastDays } from '../utils/dateUtils';

let db: SQLite.SQLiteDatabase | null = null;

// データベースを開く
export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('nottodo.db');
  return db;
};

// データベース初期化
export const initDatabase = async (): Promise<void> => {
  const database = await openDatabase();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS not_todo_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      categoryId TEXT NOT NULL,
      durationType TEXT NOT NULL CHECK (durationType IN ('permanent', 'temporary')),
      startDate TEXT,
      endDate TEXT,
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS violations (
      id TEXT PRIMARY KEY,
      notTodoId TEXT NOT NULL,
      memo TEXT,
      occurredAt TEXT NOT NULL,
      FOREIGN KEY (notTodoId) REFERENCES not_todo_items(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      reminderEnabled INTEGER NOT NULL DEFAULT 0,
      reminderFrequency TEXT NOT NULL DEFAULT 'daily',
      reminderTime TEXT NOT NULL DEFAULT '09:00'
    );

    INSERT OR IGNORE INTO settings (id, reminderEnabled, reminderFrequency, reminderTime)
    VALUES (1, 0, 'daily', '09:00');
  `);
};

// カテゴリ操作
export const getAllCategories = async (): Promise<Category[]> => {
  const database = await openDatabase();
  return await database.getAllAsync<Category>('SELECT * FROM categories ORDER BY createdAt');
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const database = await openDatabase();
  return await database.getFirstAsync<Category>('SELECT * FROM categories WHERE id = ?', [id]);
};

export const insertCategory = async (category: Category): Promise<void> => {
  const database = await openDatabase();
  await database.runAsync(
    'INSERT INTO categories (id, name, color, createdAt) VALUES (?, ?, ?, ?)',
    [category.id, category.name, category.color, category.createdAt]
  );
};

export const updateCategory = async (category: Category): Promise<void> => {
  const database = await openDatabase();
  await database.runAsync(
    'UPDATE categories SET name = ?, color = ? WHERE id = ?',
    [category.name, category.color, category.id]
  );
};

export const deleteCategory = async (id: string): Promise<void> => {
  const database = await openDatabase();
  await database.runAsync('DELETE FROM categories WHERE id = ?', [id]);
};

// やらないこと操作
export const getAllNotTodoItems = async (): Promise<NotTodoItemWithCount[]> => {
  const database = await openDatabase();
  const items = await database.getAllAsync<NotTodoItem & { violationCount: number }>(
    `SELECT
      n.*,
      COALESCE(COUNT(v.id), 0) as violationCount
    FROM not_todo_items n
    LEFT JOIN violations v ON n.id = v.notTodoId
    GROUP BY n.id
    ORDER BY n.createdAt DESC`
  );

  const categories = await getAllCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return items.map((item) => ({
    ...item,
    isActive: Boolean(item.isActive),
    category: categoryMap.get(item.categoryId),
  }));
};

export const getNotTodoItemById = async (id: string): Promise<NotTodoItemWithCount | null> => {
  const database = await openDatabase();
  const item = await database.getFirstAsync<NotTodoItem & { violationCount: number }>(
    `SELECT
      n.*,
      COALESCE(COUNT(v.id), 0) as violationCount
    FROM not_todo_items n
    LEFT JOIN violations v ON n.id = v.notTodoId
    WHERE n.id = ?
    GROUP BY n.id`,
    [id]
  );

  if (!item) return null;

  const category = await getCategoryById(item.categoryId);
  return {
    ...item,
    isActive: Boolean(item.isActive),
    category: category || undefined,
  };
};

export const insertNotTodoItem = async (item: NotTodoItem): Promise<void> => {
  const database = await openDatabase();
  await database.runAsync(
    `INSERT INTO not_todo_items
      (id, title, description, categoryId, durationType, startDate, endDate, isActive, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.title,
      item.description || null,
      item.categoryId,
      item.durationType,
      item.startDate || null,
      item.endDate || null,
      item.isActive ? 1 : 0,
      item.createdAt,
    ]
  );
};

export const updateNotTodoItem = async (item: NotTodoItem): Promise<void> => {
  const database = await openDatabase();
  await database.runAsync(
    `UPDATE not_todo_items SET
      title = ?, description = ?, categoryId = ?, durationType = ?,
      startDate = ?, endDate = ?, isActive = ?
    WHERE id = ?`,
    [
      item.title,
      item.description || null,
      item.categoryId,
      item.durationType,
      item.startDate || null,
      item.endDate || null,
      item.isActive ? 1 : 0,
      item.id,
    ]
  );
};

export const deleteNotTodoItem = async (id: string): Promise<void> => {
  const database = await openDatabase();
  await database.runAsync('DELETE FROM violations WHERE notTodoId = ?', [id]);
  await database.runAsync('DELETE FROM not_todo_items WHERE id = ?', [id]);
};

// 違反操作
export const getViolationsByNotTodoId = async (notTodoId: string): Promise<Violation[]> => {
  const database = await openDatabase();
  return await database.getAllAsync<Violation>(
    'SELECT * FROM violations WHERE notTodoId = ? ORDER BY occurredAt DESC',
    [notTodoId]
  );
};

export const insertViolation = async (violation: Violation): Promise<void> => {
  const database = await openDatabase();
  await database.runAsync(
    'INSERT INTO violations (id, notTodoId, memo, occurredAt) VALUES (?, ?, ?, ?)',
    [violation.id, violation.notTodoId, violation.memo || null, violation.occurredAt]
  );
};

export const deleteViolation = async (id: string): Promise<void> => {
  const database = await openDatabase();
  await database.runAsync('DELETE FROM violations WHERE id = ?', [id]);
};

// 設定操作
export const getSettings = async (): Promise<Settings> => {
  const database = await openDatabase();
  const result = await database.getFirstAsync<{
    reminderEnabled: number;
    reminderFrequency: string;
    reminderTime: string;
  }>('SELECT * FROM settings WHERE id = 1');

  return {
    reminderEnabled: Boolean(result?.reminderEnabled),
    reminderFrequency: (result?.reminderFrequency as 'daily' | 'weekly') || 'daily',
    reminderTime: result?.reminderTime || '09:00',
  };
};

export const updateSettings = async (settings: Settings): Promise<void> => {
  const database = await openDatabase();
  await database.runAsync(
    `UPDATE settings SET
      reminderEnabled = ?, reminderFrequency = ?, reminderTime = ?
    WHERE id = 1`,
    [settings.reminderEnabled ? 1 : 0, settings.reminderFrequency, settings.reminderTime]
  );
};

// 統計
export const getViolationStats = async (days: number = 30): Promise<ViolationStats> => {
  const database = await openDatabase();

  // 全違反データを取得
  const violations = await database.getAllAsync<Violation & { categoryId: string }>(
    `SELECT v.*, n.categoryId
    FROM violations v
    JOIN not_todo_items n ON v.notTodoId = n.id
    WHERE v.occurredAt >= date('now', '-${days} days')
    ORDER BY v.occurredAt`
  );

  const categories = await getAllCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  // 総違反数
  const totalViolations = violations.length;

  // カテゴリ別
  const byCategoryMap = new Map<string, number>();
  violations.forEach((v) => {
    byCategoryMap.set(v.categoryId, (byCategoryMap.get(v.categoryId) || 0) + 1);
  });
  const byCategory = Array.from(byCategoryMap.entries()).map(([categoryId, count]) => {
    const cat = categoryMap.get(categoryId);
    return {
      categoryId,
      categoryName: cat?.name || '不明',
      count,
      color: cat?.color || '#999999',
    };
  }).sort((a, b) => b.count - a.count);

  // 曜日別
  const byWeekdayMap = new Map<number, number>();
  violations.forEach((v) => {
    const weekday = getWeekday(v.occurredAt);
    byWeekdayMap.set(weekday, (byWeekdayMap.get(weekday) || 0) + 1);
  });
  const byWeekday = Array.from({ length: 7 }, (_, i) => ({
    weekday: i,
    count: byWeekdayMap.get(i) || 0,
  }));

  // 時間帯別
  const byHourMap = new Map<number, number>();
  violations.forEach((v) => {
    const hour = getHour(v.occurredAt);
    byHourMap.set(hour, (byHourMap.get(hour) || 0) + 1);
  });
  const byHour = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: byHourMap.get(i) || 0,
  }));

  // トレンド（日別）
  const pastDays = getPastDays(days);
  const byDateMap = new Map<string, number>();
  violations.forEach((v) => {
    const date = v.occurredAt.substring(0, 10);
    byDateMap.set(date, (byDateMap.get(date) || 0) + 1);
  });
  const trend = pastDays.map((date) => ({
    date,
    count: byDateMap.get(date) || 0,
  }));

  return {
    totalViolations,
    byCategory,
    byWeekday,
    byHour,
    trend,
  };
};
