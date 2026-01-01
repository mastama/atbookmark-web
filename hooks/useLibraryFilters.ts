"use client";

import { useState, useMemo, useCallback } from "react";
import {
    startOfToday,
    startOfWeek,
    startOfMonth,
    startOfYear,
    isAfter,
    isWithinInterval,
} from "date-fns";
import { useBookmarks, Bookmark } from "@/hooks/useBookmarks";

// Filter Types
export type DateFilter = "all" | "today" | "week" | "month" | "year";
export type StatusFilter = "all" | "read" | "unread" | "favorite";
export type ViewMode = "grid" | "table";

interface UseLibraryFiltersReturn {
    // Filter State
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    dateFilter: DateFilter;
    setDateFilter: (filter: DateFilter) => void;
    statusFilter: StatusFilter;
    setStatusFilter: (filter: StatusFilter) => void;
    folderFilter: string | null;
    setFolderFilter: (folder: string | null) => void;
    tagFilter: string | null;
    setTagFilter: (tag: string | null) => void;

    // View State
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;

    // Pagination
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (count: number) => void;
    totalPages: number;

    // Computed
    filteredBookmarks: Bookmark[];
    paginatedBookmarks: Bookmark[];
    totalCount: number;

    // Actions
    resetFilters: () => void;
}

export function useLibraryFilters(): UseLibraryFiltersReturn {
    const { bookmarks } = useBookmarks();

    // Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState<DateFilter>("all");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [folderFilter, setFolderFilter] = useState<string | null>(null);
    const [tagFilter, setTagFilter] = useState<string | null>(null);

    // View State
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    // Date filter helper
    const getDateRangeStart = useCallback((filter: DateFilter): Date | null => {
        const now = new Date();
        switch (filter) {
            case "today":
                return startOfToday();
            case "week":
                return startOfWeek(now, { weekStartsOn: 1 });
            case "month":
                return startOfMonth(now);
            case "year":
                return startOfYear(now);
            default:
                return null;
        }
    }, []);

    // Memoized filtered bookmarks
    const filteredBookmarks = useMemo(() => {
        return bookmarks.filter((bookmark) => {
            // Exclude trashed items
            if (bookmark.isTrashed) return false;

            // Search filter (title, url, domain)
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    bookmark.title.toLowerCase().includes(query) ||
                    bookmark.url.toLowerCase().includes(query) ||
                    bookmark.domain.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Date filter
            if (dateFilter !== "all") {
                const rangeStart = getDateRangeStart(dateFilter);
                if (rangeStart) {
                    const bookmarkDate = new Date(bookmark.createdAt);
                    if (!isAfter(bookmarkDate, rangeStart)) return false;
                }
            }

            // Status filter
            if (statusFilter !== "all") {
                switch (statusFilter) {
                    case "favorite":
                        if (!bookmark.isFavorite) return false;
                        break;
                    // Read/Unread would need a `isRead` field in the store
                    // For now, we'll skip these if not implemented
                    case "read":
                    case "unread":
                        // These filters are mocked for now
                        break;
                }
            }

            // Folder filter
            if (folderFilter && bookmark.folderId !== folderFilter) {
                return false;
            }

            // Tag filter
            if (tagFilter) {
                const hasTag = bookmark.tags.some(
                    (t) => t.label.toLowerCase() === tagFilter.toLowerCase() ||
                        t.id === tagFilter
                );
                if (!hasTag) return false;
            }

            return true;
        });
    }, [bookmarks, searchQuery, dateFilter, statusFilter, folderFilter, tagFilter, getDateRangeStart]);

    // Total pages
    const totalPages = Math.ceil(filteredBookmarks.length / itemsPerPage);

    // Paginated bookmarks
    const paginatedBookmarks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBookmarks.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBookmarks, currentPage, itemsPerPage]);

    // Reset filters
    const resetFilters = useCallback(() => {
        setSearchQuery("");
        setDateFilter("all");
        setStatusFilter("all");
        setFolderFilter(null);
        setTagFilter(null);
        setCurrentPage(1);
    }, []);

    // Reset page when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, dateFilter, statusFilter, folderFilter, tagFilter]);

    return {
        // Filter State
        searchQuery,
        setSearchQuery,
        dateFilter,
        setDateFilter,
        statusFilter,
        setStatusFilter,
        folderFilter,
        setFolderFilter,
        tagFilter,
        setTagFilter,

        // View State
        viewMode,
        setViewMode,

        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,

        // Computed
        filteredBookmarks,
        paginatedBookmarks,
        totalCount: filteredBookmarks.length,

        // Actions
        resetFilters,
    };
}
