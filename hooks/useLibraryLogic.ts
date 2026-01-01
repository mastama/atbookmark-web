"use client";

import { useState, useMemo, useCallback } from "react";
import {
    startOfToday,
    subDays,
    subMonths,
    startOfMonth,
    isWithinInterval,
    isAfter,
    parseISO,
} from "date-fns";
import { useBookmarks, Bookmark } from "@/hooks/useBookmarks";

// Filter Types
export type DatePreset = "all" | "today" | "7d" | "30d" | "month" | "custom";
export type StatusFilter = "all" | "unread" | "read" | "favorite";
export type ViewMode = "grid" | "table";

export interface DateRange {
    from?: Date;
    to?: Date;
}

export interface LibraryFilterState {
    searchQuery: string;
    datePreset: DatePreset;
    dateRange: DateRange;
    folderId: string | "all";
    tagId: string | "all";
    domain: string | "all";
    status: StatusFilter;
}

const DEFAULT_FILTERS: LibraryFilterState = {
    searchQuery: "",
    datePreset: "all",
    dateRange: {},
    folderId: "all",
    tagId: "all",
    domain: "all",
    status: "all",
};

interface UseLibraryLogicReturn {
    // Filter State
    filters: LibraryFilterState;
    setFilters: (filters: Partial<LibraryFilterState>) => void;
    resetFilters: () => void;
    hasActiveFilters: boolean;
    activeFilterCount: number;

    // View State
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;

    // Selection
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
    isSelected: (id: string) => boolean;
    isAllSelected: boolean;

    // Pagination
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (count: number) => void;
    totalPages: number;

    // Computed Data
    filteredBookmarks: Bookmark[];
    paginatedBookmarks: Bookmark[];
    totalCount: number;

    // Helpers
    uniqueDomains: string[];
    uniqueTags: { id: string; name: string }[];
}

export function useLibraryLogic(): UseLibraryLogicReturn {
    const { bookmarks } = useBookmarks();

    // Filter State
    const [filters, setFiltersState] = useState<LibraryFilterState>(DEFAULT_FILTERS);

    // View State
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    // Selection
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    // Partial filter updates
    const setFilters = useCallback((partial: Partial<LibraryFilterState>) => {
        setFiltersState((prev) => ({ ...prev, ...partial }));
        setCurrentPage(1); // Reset page on filter change
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState(DEFAULT_FILTERS);
        setCurrentPage(1);
    }, []);

    // Date range helper
    const getDateRange = useCallback((preset: DatePreset, customRange: DateRange): { start: Date | null; end: Date | null } => {
        const now = new Date();
        switch (preset) {
            case "today":
                return { start: startOfToday(), end: now };
            case "7d":
                return { start: subDays(now, 7), end: now };
            case "30d":
                return { start: subDays(now, 30), end: now };
            case "month":
                return { start: startOfMonth(now), end: now };
            case "custom":
                return { start: customRange.from || null, end: customRange.to || null };
            default:
                return { start: null, end: null };
        }
    }, []);

    // Memoized filtered bookmarks
    const filteredBookmarks = useMemo(() => {
        // CRITICAL: Exclude both trashed AND archived items from library
        let result = bookmarks.filter((b) => !b.isTrashed && !b.archived);

        // 1. Search filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(
                (b) =>
                    b.title.toLowerCase().includes(query) ||
                    b.url.toLowerCase().includes(query) ||
                    b.domain.toLowerCase().includes(query)
            );
        }

        // 2. Date filter
        if (filters.datePreset !== "all") {
            const { start, end } = getDateRange(filters.datePreset, filters.dateRange);
            if (start && end) {
                result = result.filter((b) => {
                    const bookmarkDate = new Date(b.createdAt);
                    return isWithinInterval(bookmarkDate, { start, end });
                });
            } else if (start) {
                result = result.filter((b) => isAfter(new Date(b.createdAt), start));
            }
        }

        // 3. Folder filter
        if (filters.folderId !== "all") {
            result = result.filter((b) => b.folderId === filters.folderId);
        }

        // 4. Tag filter
        if (filters.tagId !== "all") {
            result = result.filter((b) =>
                b.tags.some((t) => t.id === filters.tagId || t.label === filters.tagId)
            );
        }

        // 5. Domain filter
        if (filters.domain !== "all") {
            result = result.filter((b) => b.domain === filters.domain);
        }

        // 6. Status filter
        if (filters.status !== "all") {
            switch (filters.status) {
                case "favorite":
                    result = result.filter((b) => b.isFavorite);
                    break;
                case "read":
                    result = result.filter((b) => (b as any).isRead === true);
                    break;
                case "unread":
                    result = result.filter((b) => (b as any).isRead !== true);
                    break;
            }
        }

        // Sort by date descending (newest first)
        result.sort((a, b) => b.createdAt - a.createdAt);

        return result;
    }, [bookmarks, filters, getDateRange]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredBookmarks.length / itemsPerPage));

    const paginatedBookmarks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBookmarks.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBookmarks, currentPage, itemsPerPage]);

    // Selection helpers
    const toggleSelection = useCallback((id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }, []);

    const selectAll = useCallback(() => {
        const allIds = filteredBookmarks.map((b) => b.id);
        setSelectedIds(allIds);
    }, [filteredBookmarks]);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    const isSelected = useCallback((id: string) => selectedIds.includes(id), [selectedIds]);

    const isAllSelected = useMemo(
        () => filteredBookmarks.length > 0 && selectedIds.length === filteredBookmarks.length,
        [filteredBookmarks, selectedIds]
    );

    // Unique domains for filter dropdown
    const uniqueDomains = useMemo(() => {
        const domains = new Set(bookmarks.filter((b) => !b.isTrashed && !b.archived).map((b) => b.domain));
        return Array.from(domains).sort();
    }, [bookmarks]);

    // Unique tags for filter dropdown
    const uniqueTags = useMemo(() => {
        const tagMap = new Map<string, { id: string; name: string }>();
        bookmarks
            .filter((b) => !b.isTrashed && !b.archived)
            .forEach((b) => {
                b.tags.forEach((t) => {
                    if (!tagMap.has(t.label)) {
                        tagMap.set(t.label, { id: t.id || t.label, name: t.label });
                    }
                });
            });
        return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [bookmarks]);

    // Active filter helpers
    const hasActiveFilters = useMemo(
        () =>
            filters.searchQuery !== "" ||
            filters.datePreset !== "all" ||
            filters.folderId !== "all" ||
            filters.tagId !== "all" ||
            filters.domain !== "all" ||
            filters.status !== "all",
        [filters]
    );

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.searchQuery) count++;
        if (filters.datePreset !== "all") count++;
        if (filters.folderId !== "all") count++;
        if (filters.tagId !== "all") count++;
        if (filters.domain !== "all") count++;
        if (filters.status !== "all") count++;
        return count;
    }, [filters]);

    return {
        // Filter State
        filters,
        setFilters,
        resetFilters,
        hasActiveFilters,
        activeFilterCount,

        // View State
        viewMode,
        setViewMode,

        // Selection
        selectedIds,
        toggleSelection,
        selectAll,
        clearSelection,
        isSelected,
        isAllSelected,

        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,

        // Computed Data
        filteredBookmarks,
        paginatedBookmarks,
        totalCount: filteredBookmarks.length,

        // Helpers
        uniqueDomains,
        uniqueTags,
    };
}
