"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Types ---
export type Theme = "light" | "dark" | "system";
export type Density = "comfortable" | "compact";

export interface SettingsState {
    // Appearance
    theme: Theme;
    density: Density;

    // Intelligence (Pro Features)
    enableAutoTagging: boolean;
    enableAutoSummary: boolean;
    autoArchiveDays: number; // 0 = disabled, or 30, 60, 90

    // Behavior
    autoMarkUnread: boolean;
    saveToLastFolder: boolean;
    defaultReaderMode: boolean;

    // Actions
    updateSettings: (partial: Partial<Omit<SettingsState, "updateSettings" | "resetSettings">>) => void;
    resetSettings: () => void;
}

const DEFAULT_SETTINGS: Omit<SettingsState, "updateSettings" | "resetSettings"> = {
    theme: "light",
    density: "comfortable",
    enableAutoTagging: false,
    enableAutoSummary: false,
    autoArchiveDays: 0,
    autoMarkUnread: true,
    saveToLastFolder: false,
    defaultReaderMode: false,
};

export const useSettings = create<SettingsState>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,

            updateSettings: (partial) => {
                set((state) => ({ ...state, ...partial }));
            },

            resetSettings: () => {
                set(DEFAULT_SETTINGS);
            },
        }),
        {
            name: "atbookmark-settings",
        }
    )
);
