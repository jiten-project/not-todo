import { Dimensions, Platform, PixelRatio } from 'react-native';

// 画面サイズを取得
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 基準となるiPhoneのサイズ（iPhone 14/15）
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// iPadかどうかを判定
const isTablet = Platform.OS === 'ios' && (SCREEN_WIDTH >= 768 || SCREEN_HEIGHT >= 768);

// スケール係数を計算
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;
const scale = Math.min(widthScale, heightScale);

// iPad用のスケール上限（大きくなりすぎないように）
const tabletMaxScale = 1.4;
const effectiveScale = isTablet ? Math.min(scale, tabletMaxScale) : Math.min(scale, 1.2);

// フォントサイズをスケーリングする関数
export const scaledFontSize = (size: number): number => {
  const newSize = size * effectiveScale;
  // ピクセル密度に応じて丸める
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// スペーシングをスケーリングする関数
export const scaledSpacing = (size: number): number => {
  const newSize = size * effectiveScale;
  return Math.round(newSize);
};

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

// スケーリングされたスペーシング（iPadで自動的に大きくなる）
export const spacing = {
  xs: scaledSpacing(4),
  sm: scaledSpacing(8),
  md: scaledSpacing(16),
  lg: scaledSpacing(24),
  xl: scaledSpacing(32),
  xxl: scaledSpacing(48),
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// スケーリングされたフォントサイズ（iPadで自動的に大きくなる）
export const fontSize = {
  xs: scaledFontSize(12),
  sm: scaledFontSize(14),
  md: scaledFontSize(16),
  lg: scaledFontSize(18),
  xl: scaledFontSize(24),
  xxl: scaledFontSize(32),
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// デバイス情報をエクスポート
export const device = {
  isTablet,
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  scale: effectiveScale,
};
