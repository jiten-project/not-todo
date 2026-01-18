// カテゴリ
export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

// やらないこと項目
export interface NotTodoItem {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  durationType: 'permanent' | 'temporary';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

// 違反記録
export interface Violation {
  id: string;
  notTodoId: string;
  memo?: string;
  occurredAt: string;
}

// 設定
export interface Settings {
  reminderEnabled: boolean;
  reminderFrequency: 'daily' | 'weekly';
  reminderTime: string;
}

// やらないこと + 違反回数
export interface NotTodoItemWithCount extends NotTodoItem {
  violationCount: number;
  category?: Category;
}

// 統計用
export interface ViolationStats {
  totalViolations: number;
  byCategory: { categoryId: string; categoryName: string; count: number; color: string }[];
  byWeekday: { weekday: number; count: number }[];
  byHour: { hour: number; count: number }[];
  trend: { date: string; count: number }[];
}
