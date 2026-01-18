import { create } from 'zustand';
import { NotTodoItem, NotTodoItemWithCount, Violation, ViolationStats } from '../types';
import * as db from '../services/database';
import { nowISO, generateUUID } from '../utils/dateUtils';

interface NotTodoState {
  items: NotTodoItemWithCount[];
  currentItem: NotTodoItemWithCount | null;
  violations: Violation[];
  stats: ViolationStats | null;
  isLoading: boolean;
  error: string | null;

  loadItems: () => Promise<void>;
  loadItemById: (id: string) => Promise<void>;
  addItem: (item: Omit<NotTodoItem, 'id' | 'createdAt' | 'isActive'>) => Promise<NotTodoItem>;
  updateItem: (item: NotTodoItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleItemActive: (id: string) => Promise<void>;

  loadViolations: (notTodoId: string) => Promise<void>;
  addViolation: (notTodoId: string, memo?: string) => Promise<void>;
  deleteViolation: (id: string) => Promise<void>;

  loadStats: (days?: number) => Promise<void>;
}

export const useNotTodoStore = create<NotTodoState>((set, get) => ({
  items: [],
  currentItem: null,
  violations: [],
  stats: null,
  isLoading: false,
  error: null,

  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await db.getAllNotTodoItems();
      set({ items, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  loadItemById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const item = await db.getNotTodoItemById(id);
      set({ currentItem: item, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addItem: async (itemData) => {
    const item: NotTodoItem = {
      ...itemData,
      id: generateUUID(),
      isActive: true,
      createdAt: nowISO(),
    };

    await db.insertNotTodoItem(item);
    await get().loadItems();
    return item;
  },

  updateItem: async (item: NotTodoItem) => {
    await db.updateNotTodoItem(item);
    await get().loadItems();
    if (get().currentItem?.id === item.id) {
      await get().loadItemById(item.id);
    }
  },

  deleteItem: async (id: string) => {
    await db.deleteNotTodoItem(id);
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      currentItem: state.currentItem?.id === id ? null : state.currentItem,
    }));
  },

  toggleItemActive: async (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;

    const updated: NotTodoItem = {
      ...item,
      isActive: !item.isActive,
    };
    await db.updateNotTodoItem(updated);
    await get().loadItems();
  },

  loadViolations: async (notTodoId: string) => {
    try {
      const violations = await db.getViolationsByNotTodoId(notTodoId);
      set({ violations });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  addViolation: async (notTodoId: string, memo?: string) => {
    const violation: Violation = {
      id: generateUUID(),
      notTodoId,
      memo,
      occurredAt: nowISO(),
    };

    await db.insertViolation(violation);
    await get().loadViolations(notTodoId);
    await get().loadItems();
    if (get().currentItem?.id === notTodoId) {
      await get().loadItemById(notTodoId);
    }
  },

  deleteViolation: async (id: string) => {
    const violation = get().violations.find((v) => v.id === id);
    if (!violation) return;

    await db.deleteViolation(id);
    await get().loadViolations(violation.notTodoId);
    await get().loadItems();
  },

  loadStats: async (days = 30) => {
    try {
      const stats = await db.getViolationStats(days);
      set({ stats });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));
