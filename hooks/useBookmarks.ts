"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Types ---

export interface BookmarkTag {
    id: string;     // tagId
    label: string;  // tagName ex: #kulia
    color: string;
}

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    domain: string;
    coverImage: string;
    tags: BookmarkTag[];
    folderId: string;
    savedAt: string;
    readingTime: string;
    isFavorite: boolean;
    isTrashed: boolean;
    isRead: boolean;
    archived: boolean;
    createdAt: number;
    lastAccessedAt: number;  // Track when bookmark was last accessed
    archivedAt?: number;     // Track when bookmark was archived
}

interface BookmarksState {
    bookmarks: Bookmark[];

    // Actions
    addBookmark: (data: {
        url: string;
        title?: string;
        folderId?: string;
        tags?: string[];
    }) => void;
    updateBookmark: (id: string, data: {
        title?: string;
        url?: string;
        folderId?: string;
        tags?: string[];
        isRead?: boolean;
        archived?: boolean;
    }) => void;
    removeBookmark: (id: string) => void;
    toggleFavorite: (id: string) => void;
    getBookmarksByFolder: (folderId: string) => Bookmark[];
    getBookmarksByTag: (tagLabel: string) => Bookmark[];
    getBookmarkCount: (folderId: string) => number;
    getBookmarkById: (id: string) => Bookmark | undefined;

    // Bulk Actions
    trashBookmarks: (ids: string[]) => void;
    moveBookmarks: (ids: string[], folderId: string) => void;
    getBookmarkCountByTag: (tagName: string) => number;

    // FIX 3: Bulk delete tags support
    removeTagsFromBookmarks: (tagNames: string[]) => void;

    // Bulk update read status
    updateReadStatus: (ids: string[], isRead: boolean) => void;

    // Archive Actions
    archiveBookmarks: (ids: string[]) => { success: boolean; error?: string };
    restoreBookmarks: (ids: string[]) => void;
    getArchivedBookmarks: () => Bookmark[];
    getActiveBookmarks: () => Bookmark[];
    getArchivedCount: () => number;

    // Access Tracking & Auto-Archive
    recordAccess: (id: string) => void;
    runAutoArchive: () => { archivedCount: number; deletedCount: number };
    permanentlyDeleteBookmarks: (ids: string[]) => void;

    // Limit Checks - Now always returns allowed (all features free)
    canAddBookmark: () => { allowed: boolean; error?: string };
}

// --- Helpers ---

const tagColors = [
    "bg-accent-mint",
    "bg-accent-lavender",
    "bg-accent-coral",
    "bg-accent-sky",
    "bg-secondary",
];

const getRandomTagColor = () => tagColors[Math.floor(Math.random() * tagColors.length)];

const extractDomain = (url: string): string => {
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return "unknown.com";
    }
};

// FIX 2 & 4: Helper untuk normalisasi tag (lowercase & trim)
const normalizeTag = (tag: string): string => {
    const clean = tag.trim().toLowerCase();
    return clean.startsWith("#") ? clean : `#${clean}`;
};

// Time constants
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// --- Initial Data ---
// Data dummy disesuaikan dengan struktur baru (lowercase tags)
const initialBookmarks: Bookmark[] = [
    {
        id: "bm_1",
        title: "The Future of AI: What to Expect in 2025",
        url: "https://techcrunch.com/ai-2025",
        domain: "techcrunch.com",
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
        tags: [
            { id: "ai", label: "#ai", color: "bg-accent-lavender" },
            { id: "tech", label: "#tech", color: "bg-accent-sky" },
        ],
        folderId: "inbox",
        savedAt: "2 hours ago",
        readingTime: "5 min read",
        isFavorite: true,
        isTrashed: false,
        isRead: false,
        archived: false,
        createdAt: Date.now() - 7200000,
        lastAccessedAt: Date.now() - 7200000,
    },
];

// --- Store ---

export const useBookmarks = create<BookmarksState>()(
    persist(
        (set, get) => ({
            bookmarks: initialBookmarks,

            addBookmark: (data) => {
                const id = `bm_${Date.now()}`;
                const domain = extractDomain(data.url);
                const now = Date.now();

                // FIX 2: Normalize tags saat create
                const newTags: BookmarkTag[] = (data.tags || []).map((tag) => {
                    const normalizedLabel = normalizeTag(tag);
                    return {
                        id: normalizedLabel.replace("#", ""), // ID unik sederhana
                        label: normalizedLabel,
                        color: getRandomTagColor(),
                    };
                });

                const newBookmark: Bookmark = {
                    id,
                    title: data.title || domain,
                    url: data.url,
                    domain,
                    coverImage: `https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=400&h=300&fit=crop`,
                    tags: newTags,
                    folderId: data.folderId || "inbox",
                    savedAt: "Just now",
                    readingTime: `${Math.floor(Math.random() * 10) + 2} min read`,
                    isFavorite: false,
                    isTrashed: false,
                    isRead: false,
                    archived: false,
                    createdAt: now,
                    lastAccessedAt: now,
                };

                set((state) => ({
                    bookmarks: [newBookmark, ...state.bookmarks],
                }));
            },

            removeBookmark: (id) => {
                const bookmark = get().bookmarks.find((b) => b.id === id);

                if (!bookmark) return;

                const confirmDelete = window.confirm(
                    `Are you sure you want to delete the following bookmark?\n\n"${bookmark.title}"\n\nThis action cannot be undone.`
                );

                if (!confirmDelete) return;

                set((state) => ({
                    bookmarks: state.bookmarks.filter((b) => b.id !== id),
                }));
            },


            toggleFavorite: (id) => {
                set((state) => ({
                    bookmarks: state.bookmarks.map((b) =>
                        b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
                    ),
                }));
            },

            getBookmarksByFolder: (folderId) => {
                return get().bookmarks.filter((b) => b.folderId === folderId && !b.isTrashed && !b.archived);
            },

            getBookmarksByTag: (tagLabel) => {
                // FIX 4: Filter tag konsisten menggunakan normalisasi
                const target = normalizeTag(tagLabel);
                return get().bookmarks.filter((b) =>
                    !b.isTrashed && b.tags.some((t) => t.label === target)
                );
            },

            updateBookmark: (id, data) => {
                set((state) => ({
                    bookmarks: state.bookmarks.map((b) => {
                        if (b.id !== id) return b;

                        const updatedBookmark = { ...b };

                        if (data.title !== undefined) updatedBookmark.title = data.title;

                        if (data.url !== undefined) {
                            updatedBookmark.url = data.url;
                            updatedBookmark.domain = extractDomain(data.url);
                        }

                        if (data.folderId !== undefined) updatedBookmark.folderId = data.folderId;

                        // FIX 5: Update Overwrite Aneh
                        // Logic: Jangan generate warna baru jika tag sudah ada sebelumnya
                        if (data.tags !== undefined) {
                            const existingTagsMap = new Map(b.tags.map(t => [t.label, t]));

                            updatedBookmark.tags = data.tags.map((rawTag) => {
                                const label = normalizeTag(rawTag);
                                // Cek apakah tag ini sudah ada di bookmark sebelumnya?
                                const existingTag = existingTagsMap.get(label);

                                if (existingTag) {
                                    // Gunakan data lama (warna tetap sama)
                                    return existingTag;
                                } else {
                                    // Tag baru, generate warna baru
                                    return {
                                        id: label.replace("#", ""),
                                        label: label,
                                        color: getRandomTagColor(),
                                    };
                                }
                            });
                        }

                        // Handle isRead and archived updates
                        if (data.isRead !== undefined) updatedBookmark.isRead = data.isRead;
                        if (data.archived !== undefined) {
                            updatedBookmark.archived = data.archived;
                            // Set archivedAt when archiving
                            if (data.archived) {
                                updatedBookmark.archivedAt = Date.now();
                            } else {
                                updatedBookmark.archivedAt = undefined;
                            }
                        }

                        return updatedBookmark;
                    }),
                }));
            },

            getBookmarkCount: (folderId) => {
                return get().bookmarks.filter((b) => b.folderId === folderId && !b.isTrashed && !b.archived).length;
            },

            getBookmarkById: (id) => {
                return get().bookmarks.find((b) => b.id === id);
            },

            // Bulk Actions
            trashBookmarks: (ids) => {
                set((state) => ({
                    bookmarks: state.bookmarks.map((b) =>
                        ids.includes(b.id) ? { ...b, isTrashed: true } : b
                    ),
                }));
            },

            moveBookmarks: (ids, folderId) => {
                set((state) => ({
                    bookmarks: state.bookmarks.map((b) =>
                        ids.includes(b.id) ? { ...b, folderId } : b
                    ),
                }));
            },

            getBookmarkCountByTag: (tagName) => {
                const target = normalizeTag(tagName);
                return get().bookmarks.filter(
                    (b) =>
                        !b.isTrashed &&
                        b.tags.some((t) => t.label === target)
                ).length;
            },

            // FIX 1 & 3: Bulk Delete Tags & StatusTag muncul lagi
            // Menerima array strings untuk menghapus banyak tag sekaligus
            removeTagsFromBookmarks: (tagNames: string[]) => {
                // Normalisasi input array agar cocok dengan data tersimpan
                const targets = tagNames.map(t => normalizeTag(t));

                set((state) => ({
                    bookmarks: state.bookmarks.map((b) => ({
                        ...b,
                        // Hapus tag jika labelnya ada di dalam daftar targets
                        tags: b.tags.filter(
                            (t) => !targets.includes(t.label)
                        ),
                    })),
                }));
            },

            // Bulk update read status for multiple bookmarks
            updateReadStatus: (ids: string[], isRead: boolean) => {
                set((state) => ({
                    bookmarks: state.bookmarks.map((b) =>
                        ids.includes(b.id) ? { ...b, isRead } : b
                    ),
                }));
            },

            // Archive Actions - Now without limits (all free)
            archiveBookmarks: (ids: string[]) => {
                const now = Date.now();
                set((state) => ({
                    bookmarks: state.bookmarks.map((b) =>
                        ids.includes(b.id) ? { ...b, archived: true, archivedAt: now } : b
                    ),
                }));
                return { success: true };
            },

            restoreBookmarks: (ids: string[]) => {
                set((state) => ({
                    bookmarks: state.bookmarks.map((b) =>
                        ids.includes(b.id) ? { ...b, archived: false, archivedAt: undefined } : b
                    ),
                }));
            },

            getArchivedBookmarks: () => {
                return get().bookmarks.filter((b) => b.archived && !b.isTrashed);
            },

            getActiveBookmarks: () => {
                return get().bookmarks.filter((b) => !b.archived && !b.isTrashed);
            },

            getArchivedCount: () => {
                return get().bookmarks.filter((b) => b.archived && !b.isTrashed).length;
            },

            // Record access when user clicks on a bookmark
            recordAccess: (id: string) => {
                set((state) => ({
                    bookmarks: state.bookmarks.map((b) =>
                        b.id === id ? { ...b, lastAccessedAt: Date.now() } : b
                    ),
                }));
            },

            // Auto-archive: archive bookmarks not accessed for 30 days, delete archived items after 30 days
            runAutoArchive: () => {
                const now = Date.now();
                const state = get();
                let archivedCount = 0;
                let deletedCount = 0;

                // Find bookmarks to auto-archive (active, not accessed for 30 days, and already read or marked as such)
                const toArchive = state.bookmarks.filter((b) => {
                    if (b.archived || b.isTrashed) return false;
                    const lastAccess = b.lastAccessedAt || b.createdAt;
                    const daysSinceAccess = now - lastAccess;
                    // Archive if not accessed for 30 days AND (isRead OR never opened)
                    return daysSinceAccess > THIRTY_DAYS_MS;
                });

                // Find archived bookmarks to permanently delete (archived for 30 days)
                const toDelete = state.bookmarks.filter((b) => {
                    if (!b.archived || b.isTrashed) return false;
                    const archivedAt = b.archivedAt || b.createdAt;
                    const daysSinceArchived = now - archivedAt;
                    return daysSinceArchived > THIRTY_DAYS_MS;
                });

                archivedCount = toArchive.length;
                deletedCount = toDelete.length;

                const toArchiveIds = toArchive.map(b => b.id);
                const toDeleteIds = toDelete.map(b => b.id);

                set((state) => ({
                    bookmarks: state.bookmarks
                        // Remove permanently deleted bookmarks
                        .filter(b => !toDeleteIds.includes(b.id))
                        // Archive inactive bookmarks
                        .map(b =>
                            toArchiveIds.includes(b.id)
                                ? { ...b, archived: true, archivedAt: now }
                                : b
                        ),
                }));

                return { archivedCount, deletedCount };
            },

            // Permanently delete bookmarks (no confirmation, used by auto-delete)
            permanentlyDeleteBookmarks: (ids: string[]) => {
                set((state) => ({
                    bookmarks: state.bookmarks.filter(b => !ids.includes(b.id)),
                }));
            },

            // Limit Checks - Now always allowed (all features free)
            canAddBookmark: () => {
                return { allowed: true };
            },
        }),
        {
            name: "atbookmark-bookmarks",
        }
    )
);