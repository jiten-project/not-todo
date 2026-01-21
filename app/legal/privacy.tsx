import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../../constants/theme';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.lastUpdated}>最終更新日: 2025年1月18日</Text>

      <Text style={styles.heading}>1. はじめに</Text>
      <Text style={styles.paragraph}>
        「やらないこと管理」（以下、「本アプリ」）をご利用いただきありがとうございます。本プライバシーポリシーは、本アプリにおける個人情報の取り扱いについて説明します。
      </Text>

      <Text style={styles.heading}>2. 収集する情報</Text>
      <Text style={styles.paragraph}>
        本アプリは、ユーザーのプライバシーを尊重し、以下の方針に基づいて運営されています。
      </Text>
      <Text style={styles.listItem}>• 本アプリは個人情報を収集しません</Text>
      <Text style={styles.listItem}>• すべてのデータはお使いのデバイス内にのみ保存されます</Text>
      <Text style={styles.listItem}>• 外部サーバーへのデータ送信は行いません</Text>

      <Text style={styles.heading}>3. データの保存</Text>
      <Text style={styles.paragraph}>
        本アプリで作成された「やらないこと」リスト、カテゴリ、違反記録などのデータは、すべてお使いのデバイスのローカルストレージに保存されます。これらのデータは外部に送信されることはありません。
      </Text>

      <Text style={styles.heading}>4. 通知機能</Text>
      <Text style={styles.paragraph}>
        本アプリはリマインダー機能のために通知を使用します。通知の許可はユーザーの任意であり、いつでも設定から変更できます。通知データは外部に送信されません。
      </Text>

      <Text style={styles.heading}>5. 第三者サービス</Text>
      <Text style={styles.paragraph}>
        本アプリは、分析ツールや広告ネットワークなどの第三者サービスを使用していません。
      </Text>

      <Text style={styles.heading}>6. データの削除</Text>
      <Text style={styles.paragraph}>
        アプリを削除することで、保存されたすべてのデータが完全に削除されます。また、アプリ内でも個別のデータを削除することができます。
      </Text>

      <Text style={styles.heading}>7. お問い合わせ</Text>
      <Text style={styles.paragraph}>
        本プライバシーポリシーに関するご質問は、アプリのサポートページからお問い合わせください。
      </Text>

      <Text style={styles.heading}>8. 変更について</Text>
      <Text style={styles.paragraph}>
        本プライバシーポリシーは、必要に応じて更新されることがあります。重要な変更がある場合は、アプリ内でお知らせします。
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
