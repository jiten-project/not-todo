import { create } from 'zustand';
import { Settings } from '../types';
import * as db from '../services/database';

interface SettingsState {
  settings: Settings;
  isLoading: boolean;

  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
}

const defaultSettings: Settings = {
  reminderEnabled: false,
  reminderFrequency: 'daily',
  reminderTime: '09:00',
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await db.getSettings();
      set({ settings, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateSettings: async (newSettings: Partial<Settings>) => {
    const current = get().settings;
    const updated: Settings = { ...current, ...newSettings };

    await db.updateSettings(updated);
    set({ settings: updated });
  },
}));
