"use client";

import { useState, useCallback } from "react";

interface UseBulkSelectReturn<T extends { id: string }> {
    selectedIds: string[];
    isSelected: (id: string) => boolean;
    toggleSelection: (id: string) => void;
    selectAll: (items: T[]) => void;
    clearSelection: () => void;
    isSelectionMode: boolean;
    selectedCount: number;
}

export function useBulkSelect<T extends { id: string }>(): UseBulkSelectReturn<T> {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const isSelected = useCallback(
        (id: string) => selectedIds.includes(id),
        [selectedIds]
    );

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((selectedId) => selectedId !== id)
                : [...prev, id]
        );
    }, []);

    const selectAll = useCallback((items: T[]) => {
        setSelectedIds(items.map((item) => item.id));
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    return {
        selectedIds,
        isSelected,
        toggleSelection,
        selectAll,
        clearSelection,
        isSelectionMode: selectedIds.length > 0,
        selectedCount: selectedIds.length,
    };
}
