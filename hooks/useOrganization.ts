"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useBookmarks } from "./useBookmarks";

export type FolderColor = "mint" | "lavender" | "coral" | "sky" | "yellow" | "gray" | string;

export interface Folder {
    id: string;
    name: string;
    type: "system" | "custom";
    color: FolderColor;
    count: number;
    isPinned: boolean;
    parentId: string | null;
    index: number;
}

export interface Tag {
    id: string;
    name: string;
    color: FolderColor;
    isPinned: boolean;
}

interface OrganizationState {
    folders: Folder[];
    tags: Tag[];
    isPro: boolean;

    // Getters
    getSortedFolders: () => Folder[];
    getRootFolders: () => Folder[];
    getChildFolders: (parentId: string) => Folder[];
    getPinnedRootFolders: () => Folder[];
    getFolderById: (id: string) => Folder | undefined;
    getTagById: (id: string) => Tag | undefined;
    getPinnedTags: () => Tag[];
    getSortedTags: () => Tag[];

    // Folder Actions
    addFolder: (name: string, color?: FolderColor, parentId?: string | null) => { success: boolean; error?: string };
    updateFolder: (id: string, updates: Partial<Pick<Folder, "name" | "color" | "parentId">>) => void;
    deleteFolder: (id: string) => void;
    togglePin: (id: string) => void;
    setParentId: (id: string, parentId: string | null) => void;
    updateFolderCount: (id: string, count: number) => void;

    // Tag Actions
    addTag: (name: string) => { success: boolean; error?: string };
    updateTag: (id: string, name: string) => void;
    removeTag: (id: string) => void;
    removeTags: (ids: string[]) => void;
    toggleTagPin: (id: string) => void;

    // Settings
    setIsPro: (isPro: boolean) => void;
}

const FREE_FOLDER_LIMIT = 3;
const FREE_TAG_LIMIT = 3;
const PINNED_TAG_LIMIT = 5;

const colorOptions: FolderColor[] = ["mint", "lavender", "coral", "sky", "yellow"];

const getRandomColor = (): FolderColor => {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
};

// FIX 1: UUID Helper Sederhana (Aman untuk semua environment)
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useOrganization = create<OrganizationState>()(
    persist(
        (set, get) => ({
            folders: [
                { id: "inbox", name: "Inbox", type: "system", color: "gray", count: 0, isPinned: true, parentId: null, index: 0 },
                { id: "work", name: "Work", type: "custom", color: "sky", count: 0, isPinned: true, parentId: null, index: 1 },
                { id: "personal", name: "Personal", type: "custom", color: "lavender", count: 0, isPinned: true, parentId: null, index: 2 },
            ],
            tags: [
                { id: "react", name: "#React", color: "mint", isPinned: true },
                { id: "design", name: "#Design", color: "coral", isPinned: true },
            ],
            isPro: false,

            getSortedFolders: () => {
                const state = get();
                return [...state.folders].sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    if (a.type === "system" && b.type !== "system") return -1;
                    if (a.type !== "system" && b.type === "system") return 1;
                    if (a.index !== b.index) return a.index - b.index;
                    return a.name.localeCompare(b.name);
                });
            },

            getRootFolders: () => {
                return get().folders.filter((f) => f.parentId === null && f.type === "custom");
            },

            getChildFolders: (parentId: string) => {
                return get().folders.filter((f) => f.parentId === parentId);
            },

            getPinnedRootFolders: () => {
                return get().folders.filter((f) => f.isPinned && !f.parentId);
            },

            getFolderById: (id: string) => {
                return get().folders.find((f) => f.id === id);
            },

            getTagById: (id: string) => {
                return get().tags.find((t) => t.id === id);
            },

            getPinnedTags: () => {
                return get().tags.filter((t) => t.isPinned).slice(0, PINNED_TAG_LIMIT);
            },

            getSortedTags: () => {
                return [...get().tags].sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return a.name.localeCompare(b.name);
                });
            },

            addFolder: (name: string, color?: FolderColor, parentId?: string | null) => {
                const state = get();
                const customFolders = state.folders.filter((f) => f.type === "custom");

                if (!state.isPro && customFolders.length >= FREE_FOLDER_LIMIT) {
                    return { success: false, error: "LIMIT_REACHED" };
                }

                if (state.folders.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
                    return { success: false, error: "NAME_EXISTS" };
                }

                const newFolder: Folder = {
                    id: generateId(), // Ganti UUID
                    name,
                    type: "custom",
                    color: color || getRandomColor(),
                    count: 0,
                    isPinned: false,
                    parentId: parentId ?? null,
                    index: state.folders.length,
                };

                set({ folders: [...state.folders, newFolder] });
                return { success: true };
            },

            updateFolder: (id: string, updates: Partial<Pick<Folder, "name" | "color" | "parentId">>) => {
                const state = get();
                const folder = state.folders.find((f) => f.id === id);
                if (!folder || folder.type === "system") return;

                set({
                    folders: state.folders.map((f) =>
                        f.id === id ? { ...f, ...updates } : f
                    ),
                });
            },

            deleteFolder: (id: string) => {
                const state = get();
                const folder = state.folders.find((f) => f.id === id);
                if (!folder || folder.type === "system") return;

                set({
                    folders: state.folders
                        .filter((f) => f.id !== id)
                        .map((f) => (f.parentId === id ? { ...f, parentId: null } : f)),
                });
            },

            togglePin: (id: string) => {
                const state = get();
                const folder = state.folders.find((f) => f.id === id);
                if (!folder || folder.type === "system") return;

                set({
                    folders: state.folders.map((f) =>
                        f.id === id ? { ...f, isPinned: !f.isPinned } : f
                    ),
                });
            },

            setParentId: (id: string, parentId: string | null) => {
                const state = get();
                const folder = state.folders.find((f) => f.id === id);
                if (!folder || folder.type === "system") return;
                if (id === parentId) return;

                set({
                    folders: state.folders.map((f) =>
                        f.id === id ? { ...f, parentId } : f
                    ),
                });
            },

            updateFolderCount: (id: string, count: number) => {
                const state = get();
                set({
                    folders: state.folders.map((f) =>
                        f.id === id ? { ...f, count } : f
                    ),
                });
            },

            addTag: (name: string) => {
                const state = get();

                if (!state.isPro && state.tags.length >= FREE_TAG_LIMIT) {
                    return { success: false, error: "LIMIT_REACHED" };
                }

                const tagName = name.startsWith("#") ? name : `#${name}`;

                if (state.tags.some((t) => t.name.toLowerCase() === tagName.toLowerCase())) {
                    return { success: false, error: "NAME_EXISTS" };
                }

                const newTag: Tag = {
                    id: generateId(), // Ganti UUID
                    name: tagName,
                    color: getRandomColor(),
                    isPinned: false,
                };

                set({ tags: [...state.tags, newTag] });
                return { success: true };
            },

            updateTag: (id: string, name: string) => {
                const state = get();
                const tagName = name.startsWith("#") ? name : `#${name}`;
                set({
                    tags: state.tags.map((t) =>
                        t.id === id ? { ...t, name: tagName } : t
                    ),
                });
            },

            // FIX 2 & 3: Perbaikan Logika Hapus Tag
            removeTag: (id: string) => {
                const state = get();
                const tag = state.tags.find((t) => t.id === id);
                if (!tag) return;

                // Gunakan fungsi removeTagsFromBookmarks yang menerima ARRAY
                useBookmarks.getState().removeTagsFromBookmarks([tag.name]);

                set({
                    tags: state.tags.filter((t) => t.id !== id),
                });
            },

            removeTags: (ids: string[]) => {
                const state = get();
                // Cari nama tag berdasarkan ID yang mau dihapus
                const tagsToDelete = state.tags.filter((t) => ids.includes(t.id));
                const tagNames = tagsToDelete.map(t => t.name);

                // Hapus dari semua bookmark (kirim array string sekaligus)
                if (tagNames.length > 0) {
                    useBookmarks.getState().removeTagsFromBookmarks(tagNames);
                }

                // Hapus dari store Organization
                set({
                    tags: state.tags.filter((t) => !ids.includes(t.id)),
                });
            },

            toggleTagPin: (id: string) => {
                const state = get();
                const tag = state.tags.find((t) => t.id === id);
                if (!tag) return;

                const pinnedCount = state.tags.filter((t) => t.isPinned).length;

                if (!state.isPro && !tag.isPinned && pinnedCount >= PINNED_TAG_LIMIT) {
                    return;
                }

                set({
                    tags: state.tags.map((t) =>
                        t.id === id ? { ...t, isPinned: !t.isPinned } : t
                    ),
                });
            },

            setIsPro: (isPro: boolean) => {
                set({ isPro });
            },
        }),
        {
            name: "atbookmark-organization",
        }
    )
);