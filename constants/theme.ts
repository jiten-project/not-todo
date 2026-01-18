export const colors = {
  // ベースカラー
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F5',

  // テキスト
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',

  // アクセント
  primary: '#2D2D2D',
  primaryLight: '#4A4A4A',
  accent: '#FF6B6B',

  // ステータス
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',

  // ボーダー
  border: '#E0E0E0',
  borderLight: '#EEEEEE',

  // カテゴリ用カラーパレット
  categoryColors: [
    '#FF6B6B', // レッド
    '#4ECDC4', // ティール
    '#45B7D1', // ブルー
    '#96CEB4', // グリーン
    '#FFEAA7', // イエロー
    '#DDA0DD', // プラム
    '#98D8C8', // ミント
    '#F7DC6F', // ゴールド
    '#BB8FCE', // パープル
    '#85C1E9', // スカイブルー
  ],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
