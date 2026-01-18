import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useNotTodoStore } from '../../stores/notTodoStore';
import { useCategoryStore } from '../../stores/categoryStore';
import {
  Button,
  Input,
  Card,
  Badge,
  SegmentedControl,
  CategorySelector,
  DateRangePicker,
} from '../../components/ui';
import { ViolationModal } from '../../components/ViolationModal';
import { colors, spacing, fontSize, fontWeight } from '../../constants/theme';
import { Category } from '../../types';
import { formatDate, formatDateTime, getRelativeDate } from '../../utils/dateUtils';

type DurationType = 'permanent' | 'temporary';

const DURATION_OPTIONS: { value: DurationType; label: string }[] = [
  { value: 'permanent', label: '永続' },
  { value: 'temporary', label: '期間限定' },
];

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    currentItem,
    violations,
    loadItemById,
    loadViolations,
    updateItem,
    deleteItem,
    addViolation,
    deleteViolation,
  } = useNotTodoStore();
  const { categories } = useCategoryStore();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [durationType, setDurationType] = useState<DurationType>('permanent');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showViolationModal, setShowViolationModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadItemById(id);
        loadViolations(id);
      }
    }, [id])
  );

  useEffect(() => {
    if (currentItem) {
      setTitle(currentItem.title);
      setDescription(currentItem.description || '');
      setCategoryId(currentItem.categoryId);
      setDurationType(currentItem.durationType);
      if (currentItem.startDate) setStartDate(new Date(currentItem.startDate));
      if (currentItem.endDate) setEndDate(new Date(currentItem.endDate));
    }
  }, [currentItem]);

  const handleSave = async () => {
    if (!currentItem || !title.trim()) return;

    await updateItem({
      ...currentItem,
      title: title.trim(),
      description: description.trim() || undefined,
      categoryId,
      durationType,
      startDate: durationType === 'temporary' ? startDate.toISOString() : undefined,
      endDate: durationType === 'temporary' ? endDate.toISOString() : undefined,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      '削除確認',
      'この「やらないこと」を削除しますか？違反記録も一緒に削除されます。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            if (id) {
              await deleteItem(id);
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleViolationSubmit = async (memo?: string) => {
    if (id) await addViolation(id, memo);
    setShowViolationModal(false);
  };

  const handleDeleteViolation = (violationId: string) => {
    Alert.alert('削除確認', 'この違反記録を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '削除', style: 'destructive', onPress: () => deleteViolation(violationId) },
    ]);
  };

  if (!currentItem) {
    return (
      <View style={styles.loading}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  const category = categories.find((c) => c.id === currentItem.categoryId);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isEditing ? (
        <EditMode
          title={title}
          description={description}
          categoryId={categoryId}
          durationType={durationType}
          startDate={startDate}
          endDate={endDate}
          categories={categories}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onCategoryChange={setCategoryId}
          onDurationTypeChange={setDurationType}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ViewMode
          item={currentItem}
          category={category}
          violations={violations}
          onEdit={() => setIsEditing(true)}
          onViolation={() => setShowViolationModal(true)}
          onDelete={handleDelete}
          onDeleteViolation={handleDeleteViolation}
        />
      )}

      <ViolationModal
        visible={showViolationModal}
        itemTitle={currentItem.title}
        onClose={() => setShowViolationModal(false)}
        onSubmit={handleViolationSubmit}
      />
    </ScrollView>
  );
}

// 編集モードコンポーネント
interface EditModeProps {
  title: string;
  description: string;
  categoryId: string;
  durationType: DurationType;
  startDate: Date;
  endDate: Date;
  categories: Category[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (id: string) => void;
  onDurationTypeChange: (type: DurationType) => void;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditMode: React.FC<EditModeProps> = ({
  title,
  description,
  categoryId,
  durationType,
  startDate,
  endDate,
  categories,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onDurationTypeChange,
  onStartDateChange,
  onEndDateChange,
  onSave,
  onCancel,
}) => (
  <>
    <Input label="やらないこと" value={title} onChangeText={onTitleChange} />
    <Input
      label="説明（任意）"
      value={description}
      onChangeText={onDescriptionChange}
      multiline
      numberOfLines={3}
      style={styles.descriptionInput}
    />

    <Text style={styles.label}>カテゴリ</Text>
    <CategorySelector
      categories={categories}
      selectedId={categoryId}
      onSelect={onCategoryChange}
    />

    <Text style={styles.label}>期間</Text>
    <SegmentedControl
      options={DURATION_OPTIONS}
      value={durationType}
      onChange={onDurationTypeChange}
    />

    {durationType === 'temporary' && (
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
    )}

    <View style={styles.editButtons}>
      <Button title="キャンセル" variant="outline" onPress={onCancel} style={styles.editButton} />
      <Button title="保存" onPress={onSave} style={styles.editButton} />
    </View>
  </>
);

// 表示モードコンポーネント
interface ViewModeProps {
  item: {
    title: string;
    description?: string;
    durationType: string;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    violationCount: number;
  };
  category?: { name: string; color: string };
  violations: { id: string; occurredAt: string; memo?: string }[];
  onEdit: () => void;
  onViolation: () => void;
  onDelete: () => void;
  onDeleteViolation: (id: string) => void;
}

const ViewMode: React.FC<ViewModeProps> = ({
  item,
  category,
  violations,
  onEdit,
  onViolation,
  onDelete,
  onDeleteViolation,
}) => (
  <>
    <Card style={styles.detailCard}>
      <View style={styles.header}>
        <View style={[styles.categoryDot, { backgroundColor: category?.color }]} />
        <Badge label={category?.name || '未分類'} color={category?.color || colors.textTertiary} />
        {item.durationType === 'temporary' && <Badge label="期間限定" color={colors.warning} />}
      </View>

      <Text style={styles.title}>{item.title}</Text>
      {item.description && <Text style={styles.description}>{item.description}</Text>}
      {item.durationType === 'temporary' && item.endDate && (
        <Text style={styles.period}>
          {formatDate(item.startDate!)} 〜 {formatDate(item.endDate)}
        </Text>
      )}

      <View style={styles.meta}>
        <Text style={styles.metaText}>作成: {formatDate(item.createdAt)}</Text>
        <Text style={styles.metaText}>違反回数: {item.violationCount}回</Text>
      </View>
    </Card>

    <View style={styles.actionButtons}>
      <Button title="違反を記録" variant="danger" onPress={onViolation} style={styles.actionButton} />
      <Button title="編集" variant="outline" onPress={onEdit} style={styles.actionButton} />
    </View>

    <Text style={styles.sectionTitle}>違反履歴</Text>
    {violations.length === 0 ? (
      <Card style={styles.emptyCard}>
        <Text style={styles.emptyText}>まだ違反記録がありません</Text>
      </Card>
    ) : (
      violations.map((v) => (
        <Card key={v.id} style={styles.violationCard}>
          <View style={styles.violationHeader}>
            <Text style={styles.violationDate}>{getRelativeDate(v.occurredAt)}</Text>
            <TouchableOpacity onPress={() => onDeleteViolation(v.id)}>
              <Text style={styles.deleteText}>削除</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.violationTime}>{formatDateTime(v.occurredAt)}</Text>
          {v.memo && <Text style={styles.violationMemo}>{v.memo}</Text>}
        </Card>
      ))
    )}

    <Button
      title="この項目を削除"
      variant="outline"
      onPress={onDelete}
      style={styles.deleteButton}
      textStyle={styles.deleteButtonText}
    />
  </>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  descriptionInput: { minHeight: 80, textAlignVertical: 'top' },
  editButtons: { flexDirection: 'row', gap: spacing.sm },
  editButton: { flex: 1 },
  detailCard: { marginBottom: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  categoryDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  period: { fontSize: fontSize.sm, color: colors.textTertiary, marginBottom: spacing.sm },
  meta: { paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderLight },
  metaText: { fontSize: fontSize.sm, color: colors.textTertiary, marginBottom: 2 },
  actionButtons: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  actionButton: { flex: 1 },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyCard: { alignItems: 'center', paddingVertical: spacing.lg },
  emptyText: { fontSize: fontSize.sm, color: colors.textTertiary },
  violationCard: { marginBottom: spacing.sm },
  violationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  violationDate: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.textPrimary },
  deleteText: { fontSize: fontSize.sm, color: colors.error },
  violationTime: { fontSize: fontSize.sm, color: colors.textTertiary, marginBottom: spacing.xs },
  violationMemo: { fontSize: fontSize.sm, color: colors.textSecondary, fontStyle: 'italic' },
  deleteButton: { marginTop: spacing.xl, borderColor: colors.error },
  deleteButtonText: { color: colors.error },
});
