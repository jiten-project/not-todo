import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../../constants/theme';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.lastUpdated}>最終更新日: 2025年1月18日</Text>

      <Text style={styles.heading}>1. はじめに</Text>
      <Text style={styles.paragraph}>
        本利用規約（以下、「本規約」）は、「Not Todo」アプリケーション（以下、「本アプリ」）の利用条件を定めるものです。本アプリをご利用いただく前に、本規約をよくお読みください。
      </Text>

      <Text style={styles.heading}>2. サービスの説明</Text>
      <Text style={styles.paragraph}>
        本アプリは、ユーザーが「やらないこと」を管理し、習慣改善をサポートするためのツールです。
      </Text>

      <Text style={styles.heading}>3. 免責事項</Text>
      <Text style={styles.paragraph}>
        本アプリは「現状有姿」で提供されます。開発者は以下について一切の保証を行いません。
      </Text>
      <Text style={styles.listItem}>• 本アプリの動作の完全性、正確性、信頼性</Text>
      <Text style={styles.listItem}>• 本アプリの利用による特定の目的への適合性</Text>
      <Text style={styles.listItem}>• 本アプリの中断なき利用、エラーのない動作</Text>
      <Text style={styles.listItem}>• データの保存、バックアップの完全性</Text>

      <Text style={styles.heading}>4. 責任の制限</Text>
      <Text style={styles.paragraph}>
        法律で許容される最大限の範囲において、開発者は本アプリの使用または使用不能から生じるいかなる損害（直接的、間接的、偶発的、特別、結果的損害を含む）についても責任を負いません。
      </Text>

      <Text style={styles.heading}>5. データの取り扱い</Text>
      <Text style={styles.paragraph}>
        本アプリで作成されたデータはユーザーのデバイス内にのみ保存されます。データのバックアップはユーザーの責任で行ってください。アプリの削除やデバイスの変更によりデータが失われた場合、復元することはできません。
      </Text>

      <Text style={styles.heading}>6. 禁止事項</Text>
      <Text style={styles.paragraph}>
        ユーザーは以下の行為を行ってはなりません。
      </Text>
      <Text style={styles.listItem}>• 本アプリの逆コンパイル、リバースエンジニアリング</Text>
      <Text style={styles.listItem}>• 本アプリの不正な改変、複製、再配布</Text>
      <Text style={styles.listItem}>• 違法な目的での本アプリの使用</Text>

      <Text style={styles.heading}>7. 知的財産権</Text>
      <Text style={styles.paragraph}>
        本アプリおよびそのコンテンツに関するすべての知的財産権は、開発者に帰属します。
      </Text>

      <Text style={styles.heading}>8. 規約の変更</Text>
      <Text style={styles.paragraph}>
        開発者は、必要に応じて本規約を変更することがあります。変更後の規約は、本アプリ内での公開をもって効力を生じます。
      </Text>

      <Text style={styles.heading}>9. 準拠法</Text>
      <Text style={styles.paragraph}>
        本規約は日本法に準拠し、解釈されるものとします。
      </Text>

      <Text style={styles.heading}>10. お問い合わせ</Text>
      <Text style={styles.paragraph}>
        本規約に関するご質問は、アプリのサポートページからお問い合わせください。
      </Text>
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
  lastUpdated: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.lg,
  },
  heading: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  listItem: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
});
