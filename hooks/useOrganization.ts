"use client";

import { create } from "zustand";
import api from "@/lib/api";
import { toast } from "sonner";
import { useBookmarks } from "./useBookmarks";

export type FolderColor = "mint" | "lavender" | "coral" | "sky" | "yellow" | "gray" | string;

export interface Folder {
    id: string;
    name: string;
    type: "system" | "custom";
    color: FolderColor;
    count: number; // Front-end derived
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
    isLoading: boolean;

    // Actions
    fetchOrganization: () => Promise<void>;

    // Folder Actions
    addFolder: (name: string, color?: FolderColor, parentId?: string | null) => Promise<{ success: boolean; error?: string }>;
    updateFolder: (id: string, updates: Partial<Pick<Folder, "name" | "color" | "parentId" | "isPinned" | "index">>) => Promise<void>;
    setParentId: (id: string, parentId: string | null) => Promise<void>;
    deleteFolder: (id: string) => Promise<void>;
    togglePin: (id: string) => Promise<void>;

    // Tag Actions
    addTag: (name: string) => Promise<{ success: boolean; error?: string }>; // Backend doesn't support this yet?
    updateTag: (id: string, name: string) => Promise<void>;
    removeTag: (id: string) => Promise<void>;
    removeTags: (ids: string[]) => Promise<void>;
    toggleTagPin: (id: string) => Promise<void>;

    // Getters
    getSortedFolders: () => Folder[];
    getRootFolders: () => Folder[];
    getChildFolders: (parentId: string) => Folder[];
    getPinnedRootFolders: () => Folder[];
    getFolderById: (id: string) => Folder | undefined;
    getTagById: (id: string) => Tag | undefined;
    getPinnedTags: () => Tag[];
    getSortedTags: () => Tag[];

    // Sync Helper
    recalcCounts: () => void;
}

const colorOptions: FolderColor[] = ["mint", "lavender", "coral", "sky", "yellow"];
const getRandomColor = (): FolderColor => colorOptions[Math.floor(Math.random() * colorOptions.length)];

// Helper to map backend Folder to Frontend
const mapFolder = (data: any): Folder => ({
    id: data.id,
    name: data.name,
    type: data.type,
    color: data.color || "gray",
    count: 0, // Calculated later
    isPinned: data.isPinned,
    parentId: data.parentId,
    index: data.index
});

const mapTag = (data: any): Tag => ({
    id: data.id,
    name: data.name, // #hashtag
    color: data.color || "mint",
    isPinned: data.isPinned
});

export const useOrganization = create<OrganizationState>((set, get) => ({
    folders: [],
    tags: [],
    isPro: true, // Defaulting to true for now, or fetch from profile
    isLoading: false,

    fetchOrganization: async () => {
        set({ isLoading: true });
        try {
            const [foldersRes, tagsRes] = await Promise.all([
                api.get('/folders'),
                api.get('/tags')
            ]);

            const folders = foldersRes.data.data.map(mapFolder);
            const tags = tagsRes.data.data.map(mapTag);

            set({ folders, tags });
            get().recalcCounts();
        } catch (error) {
            console.error("Failed to fetch organization", error);
            // toast.error("Failed to load organization");
        } finally {
            set({ isLoading: false });
        }
    },

    addFolder: async (name, color, parentId) => {
        try {
            const response = await api.post('/folders', {
                name,
                color: color || getRandomColor(),
                parentId,
                type: 'custom'
            });
            const newFolder = mapFolder(response.data.data);
            set(state => ({ folders: [...state.folders, newFolder] }));
            return { success: true };
        } catch (error: any) {
            toast.error("Failed to create folder");
            return { success: false, error: error.message };
        }
    },

    updateFolder: async (id, updates) => {
        // Optimistic
        set(state => ({
            folders: state.folders.map(f => f.id === id ? { ...f, ...updates } : f)
        }));

        try {
            await api.patch(`/folders/${id}`, updates);
        } catch (error) {
            toast.error("Failed to update folder");
            // Revert? (Complex, skipping for MVP)
        }
    },

    setParentId: (id: string, parentId: string | null) => get().updateFolder(id, { parentId }),

    deleteFolder: async (id) => {
        try {
            await api.delete(`/folders/${id}`);
            set(state => ({
                folders: state.folders.filter(f => f.id !== id)
            }));
            toast.success("Folder deleted");
        } catch (error) {
            toast.error("Failed to delete folder");
        }
    },

    togglePin: async (id) => {
        const folder = get().getFolderById(id);
        if (!folder) return;
        get().updateFolder(id, { isPinned: !folder.isPinned });
    },

    // TAGS

    addTag: async (name) => {
        try {
            const response = await api.post('/tags', {
                name,
                color: getRandomColor()
            });

            // If the tag essentially already existed (backend returned existing), we should check
            // if we already have it in store to avoid duplicates in UI state array
            const newTag = mapTag(response.data.data);

            set(state => {
                const exists = state.tags.find(t => t.id === newTag.id);
                if (exists) return state;
                return { tags: [...state.tags, newTag] };
            });

            return { success: true };
        } catch (error: any) {
            toast.error("Failed to create tag");
            return { success: false, error: error.message };
        }
    },

    updateTag: async (id, name) => {
        // Optimistic
        set(state => ({
            tags: state.tags.map(t => t.id === id ? { ...t, name } : t)
        }));
        try {
            await api.patch(`/tags/${id}`, { name });
        } catch (e) { toast.error("Failed to update tag"); }
    },

    removeTag: async (id) => {
        try {
            await api.delete(`/tags/${id}`);
            set(state => ({
                tags: state.tags.filter(t => t.id !== id)
            }));
            toast.success("Tag deleted");
        } catch (e) { toast.error("Failed to delete tag"); }
    },

    removeTags: async (ids: string[]) => {
        try {
            // Sequential delete for now as backend might not support bulk delete yet, 
            // or use Promise.all. 
            // Better UX to use Promise.all to be faster. 
            // If backend has bulk endpoint, use that.
            // Assuming individual delete is safer for now based on other patterns.
            await Promise.all(ids.map(id => api.delete(`/tags/${id}`)));

            set(state => ({
                tags: state.tags.filter(t => !ids.includes(t.id))
            }));
        } catch (e) {
            toast.error("Failed to delete some tags");
            // Reload to be safe?
            get().fetchOrganization();
        }
    },

    toggleTagPin: async (id) => {
        const tag = get().getTagById(id);
        if (!tag) return;

        set(state => ({
            tags: state.tags.map(t => t.id === id ? { ...t, isPinned: !tag.isPinned } : t)
        }));

        try {
            await api.patch(`/tags/${id}`, { isPinned: !tag.isPinned });
        } catch (e) { }
    },

    recalcCounts: () => {
        // Calculate counts based on useBookmarks Store?
        // Actually this creates a dependency cycle or sync issue if not careful.
        // Ideally Sidebar component calls getBookmarkCount from useBookmarks directly.
        // We'll leave count as 0 here and let UI derive it.
    },

    // Getters (Standard sorting)
    getSortedFolders: () => {
        const state = get();
        return [...state.folders].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            if (a.type === "system" && b.type !== "system") return -1;
            if (a.type !== "system" && b.type === "system") return 1;
            return a.index - b.index || a.name.localeCompare(b.name);
        });
    },

    getRootFolders: () => get().folders.filter((f) => !f.parentId && f.type === 'custom'),
    getChildFolders: (parentId) => get().folders.filter((f) => f.parentId === parentId),
    getPinnedRootFolders: () => get().folders.filter((f) => f.isPinned && !f.parentId),

    getFolderById: (id) => get().folders.find((f) => f.id === id),
    getTagById: (id) => get().tags.find((t) => t.id === id),

    getPinnedTags: () => get().tags.filter((t) => t.isPinned),
    getSortedTags: () => [...get().tags].sort((a, b) => a.name.localeCompare(b.name)),
}));