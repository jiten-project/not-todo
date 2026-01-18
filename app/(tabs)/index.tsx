import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useNotTodoStore } from '../../stores/notTodoStore';
import { NotTodoItemComponent } from '../../components/NotTodoItem';
import { ViolationModal } from '../../components/ViolationModal';
import { EmptyState } from '../../components/ui';
import { NotTodoItemWithCount } from '../../types';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { items, isLoading, loadItems, addViolation } = useNotTodoStore();
  const [refreshing, setRefreshing] = useState(false);
  const [violationModal, setViolationModal] = useState<{
    visible: boolean;
    item: NotTodoItemWithCount | null;
  }>({ visible: false, item: null });

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const handleItemPress = (item: NotTodoItemWithCount) => {
    router.push(`/item/${item.id}`);
  };

  const handleViolationPress = (item: NotTodoItemWithCount) => {
    setViolationModal({ visible: true, item });
  };

  const handleViolationSubmit = async (memo?: string) => {
    if (violationModal.item) {
      await addViolation(violationModal.item.id, memo);
    }
    setViolationModal({ visible: false, item: null });
  };

  const handleAddPress = () => {
    router.push('/item/new');
  };

  const renderItem = ({ item }: { item: NotTodoItemWithCount }) => (
    <NotTodoItemComponent
      item={item}
      onPress={() => handleItemPress(item)}
      onViolationPress={() => handleViolationPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          items.length === 0 && styles.emptyList,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="🚫"
            title="やらないことがありません"
            description="「+」ボタンから追加しましょう"
          />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddPress} activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <ViolationModal
        visible={violationModal.visible}
        itemTitle={violationModal.item?.title || ''}
        onClose={() => setViolationModal({ visible: false, item: null })}
        onSubmit={handleViolationSubmit}
      />
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
  emptyList: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    marginTop: -2,
  },
});
