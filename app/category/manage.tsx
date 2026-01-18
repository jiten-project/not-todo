import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCategoryStore } from '../../stores/categoryStore';
import { Button, Input, Card } from '../../components/ui';
import { Category } from '../../types';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';

export default function CategoryManageScreen() {
  const insets = useSafeAreaInsets();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors.categoryColors[0]);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSelectedColor(colors.categoryColors[0]);
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSelectedColor(category.color);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('エラー', 'カテゴリ名を入力してください');
      return;
    }

    if (editingCategory) {
      await updateCategory(editingCategory.id, name.trim(), selectedColor);
    } else {
      await addCategory(name.trim(), selectedColor);
    }
    setShowModal(false);
  };

  const handleDelete = (category: Category) => {
    Alert.alert(
      '削除確認',
      `「${category.name}」を削除しますか？このカテゴリを使用している項目も確認してください。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteCategory(category.id),
        },
      ]
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <Card style={styles.categoryCard}>
      <TouchableOpacity
        style={styles.categoryContent}
        onPress={() => openEditModal(item)}
      >
        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.editText}>編集</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>カテゴリがありません</Text>
            <Text style={styles.emptyDescription}>
              下のボタンからカテゴリを追加してください
            </Text>
          </View>
        }
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button title="カテゴリを追加" onPress={openAddModal} />
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>
                {editingCategory ? 'カテゴリを編集' : 'カテゴリを追加'}
              </Text>

              <Input
                label="カテゴリ名"
                placeholder="例: 仕事、健康、プライベート"
                value={name}
                onChangeText={setName}
                autoFocus
              />

              <Text style={styles.colorLabel}>カラー</Text>
              <View style={styles.colorGrid}>
                {colors.categoryColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                {editingCategory && (
                  <Button
                    title="削除"
                    variant="danger"
                    onPress={() => {
                      setShowModal(false);
                      handleDelete(editingCategory);
                    }}
                    style={styles.deleteButton}
                  />
                )}
                <Button
                  title="キャンセル"
                  variant="outline"
                  onPress={() => setShowModal(false)}
                  style={styles.modalButton}
                />
                <Button
                  title="保存"
                  onPress={handleSave}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  categoryCard: {
    marginBottom: spacing.sm,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  categoryName: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  editText: {
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  colorLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: colors.textPrimary,
  },
  checkmark: {
    color: colors.surface,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 0.8,
  },
});
