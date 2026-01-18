import React from 'react';
import { ScrollView, Text, View, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';

interface License {
  name: string;
  version: string;
  license: string;
  url: string;
}

const LICENSES: License[] = [
  { name: 'React', version: '18.3.1', license: 'MIT', url: 'https://github.com/facebook/react' },
  { name: 'React Native', version: '0.76.6', license: 'MIT', url: 'https://github.com/facebook/react-native' },
  { name: 'Expo', version: '~52.0.28', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'Expo Router', version: '~4.0.17', license: 'MIT', url: 'https://github.com/expo/router' },
  { name: 'Expo SQLite', version: '~15.1.2', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'Expo Crypto', version: '~14.1.0', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'Expo Notifications', version: '~0.29.13', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'Zustand', version: '^5.0.3', license: 'MIT', url: 'https://github.com/pmndrs/zustand' },
  { name: 'date-fns', version: '^4.1.0', license: 'MIT', url: 'https://github.com/date-fns/date-fns' },
  { name: 'React Native Chart Kit', version: '^6.12.0', license: 'MIT', url: 'https://github.com/indiespirit/react-native-chart-kit' },
  { name: 'React Native SVG', version: '15.8.0', license: 'MIT', url: 'https://github.com/software-mansion/react-native-svg' },
  { name: '@react-native-community/datetimepicker', version: '8.2.0', license: 'MIT', url: 'https://github.com/react-native-datetimepicker/datetimepicker' },
];

export default function LicensesScreen() {
  const handleOpenUrl = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.description}>
        本アプリは以下のオープンソースライブラリを使用しています。各ライブラリの開発者に感謝します。
      </Text>

      {LICENSES.map((lib, index) => (
        <TouchableOpacity
          key={index}
          style={styles.licenseCard}
          onPress={() => handleOpenUrl(lib.url)}
        >
          <View style={styles.licenseHeader}>
            <Text style={styles.licenseName}>{lib.name}</Text>
            <Text style={styles.licenseVersion}>{lib.version}</Text>
          </View>
          <Text style={styles.licenseType}>{lib.license} License</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.footer}>
        タップすると各ライブラリのGitHubページが開きます
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
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  licenseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  licenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  licenseName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  licenseVersion: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  licenseType: {
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  footer: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
