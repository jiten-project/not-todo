import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useNotTodoStore } from '../../stores/notTodoStore';
import { useCategoryStore } from '../../stores/categoryStore';
import {
  Button,
  Input,
  Card,
  SegmentedControl,
  CategorySelector,
  DateRangePicker,
} from '../../components/ui';
import { colors, spacing, fontSize, fontWeight } from '../../constants/theme';

type DurationType = 'permanent' | 'temporary';

const DURATION_OPTIONS: { value: DurationType; label: string }[] = [
  { value: 'permanent', label: '永続' },
  { value: 'temporary', label: '期間限定' },
];

export default function NewItemScreen() {
  const router = useRouter();
  const { addItem } = useNotTodoStore();
  const { categories } = useCategoryStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [durationType, setDurationType] = useState<DurationType>('permanent');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }

    if (!categoryId) {
      Alert.alert('エラー', 'カテゴリを選択してください。設定からカテゴリを追加できます。');
      return;
    }

    setIsSubmitting(true);
    try {
      await addItem({
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId,
        durationType,
        startDate: durationType === 'temporary' ? startDate.toISOString() : undefined,
        endDate: durationType === 'temporary' ? endDate.toISOString() : undefined,
      });
      router.back();
    } catch {
      Alert.alert('エラー', '保存に失敗しました');
    }
    setIsSubmitting(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input
        label="やらないこと"
        placeholder="例: 寝る前にスマホを見る"
        value={title}
        onChangeText={setTitle}
        autoFocus
      />

      <Input
        label="説明（任意）"
        placeholder="詳細な説明やメモ"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.descriptionInput}
      />

      <Text style={styles.label}>カテゴリ</Text>
      {categories.length === 0 ? (
        <Card style={styles.noCategoryCard}>
          <Text style={styles.noCategoryText}>
            カテゴリがありません。設定から追加してください。
          </Text>
          <Button
            title="カテゴリを追加"
            variant="outline"
            size="small"
            onPress={() => router.push('/category/manage')}
          />
        </Card>
      ) : (
        <CategorySelector
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />
      )}

      <Text style={styles.label}>期間</Text>
      <SegmentedControl
        options={DURATION_OPTIONS}
        value={durationType}
        onChange={setDurationType}
      />

      {durationType === 'temporary' && (
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="保存"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!title.trim() || !categoryId}
        />
      </View>
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
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  noCategoryCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  noCategoryText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
