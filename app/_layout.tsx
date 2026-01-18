import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { initDatabase } from '../services/database';
import { useCategoryStore } from '../stores/categoryStore';
import { useNotTodoStore } from '../stores/notTodoStore';
import { useSettingsStore } from '../stores/settingsStore';
import { colors, fontWeight } from '../constants/theme';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const loadCategories = useCategoryStore((s) => s.loadCategories);
  const loadItems = useNotTodoStore((s) => s.loadItems);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        await Promise.all([loadCategories(), loadItems(), loadSettings()]);
      } catch (error) {
        console.error('Failed to initialize:', error);
      }
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: fontWeight.bold },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="item/new"
          options={{
            title: '新規作成',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="item/[id]"
          options={{
            title: '詳細',
            headerBackTitle: '戻る',
          }}
        />
        <Stack.Screen
          name="category/manage"
          options={{
            title: 'カテゴリ管理',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
