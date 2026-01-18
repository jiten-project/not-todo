import { create } from 'zustand';
import { Category } from '../types';
import * as db from '../services/database';
import { nowISO, generateUUID } from '../utils/dateUtils';
import { colors } from '../constants/theme';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  loadCategories: () => Promise<void>;
  addCategory: (name: string, color?: string) => Promise<Category>;
  updateCategory: (id: string, name: string, color: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await db.getAllCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addCategory: async (name: string, color?: string) => {
    const existingColors = get().categories.map((c) => c.color);
    const availableColors = colors.categoryColors.filter((c) => !existingColors.includes(c));
    const selectedColor = color || availableColors[0] || colors.categoryColors[0];

    const category: Category = {
      id: generateUUID(),
      name,
      color: selectedColor,
      createdAt: nowISO(),
    };

    await db.insertCategory(category);
    set((state) => ({ categories: [...state.categories, category] }));
    return category;
  },

  updateCategory: async (id: string, name: string, color: string) => {
    const category = get().categories.find((c) => c.id === id);
    if (!category) return;

    const updated: Category = { ...category, name, color };
    await db.updateCategory(updated);
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? updated : c)),
    }));
  },

  deleteCategory: async (id: string) => {
    await db.deleteCategory(id);
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },

  getCategoryById: (id: string) => {
    return get().categories.find((c) => c.id === id);
  },
}));
