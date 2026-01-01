"use client";

import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Library,
} from "lucide-react";
import { BookmarkCard } from "@/components/dashboard/BookmarkCard";
import { BookmarkTable } from "@/components/dashboard/library/BookmarkTable";
import { LibraryHeader } from "@/components/dashboard/library/LibraryHeader";
import { BulkToolbar } from "@/components/bulk/BulkToolbar";
import { useLibraryLogic } from "@/hooks/useLibraryLogic";
import { Button } from "@/components/ui/button";

const PAGE_SIZE_OPTIONS = [12, 24, 48];

export default function LibraryPage() {
    const {
        filters,
        setFilters,
        resetFilters,
        hasActiveFilters,
        activeFilterCount,
        viewMode,
        setViewMode,
        selectedIds,
        toggleSelection,
        selectAll,
        clearSelection,
        isSelected,
        isAllSelected,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        paginatedBookmarks,
        filteredBookmarks,
        totalCount,
        uniqueDomains,
        uniqueTags,
    } = useLibraryLogic();

    return (
        <div className="mx-auto max-w-6xl pb-12">
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-lavender border-2 border-border">
                        <Library className="h-5 w-5 text-purple-600" />
                    </div>
                    <h1 className="font-display text-2xl font-bold">All Library</h1>
                </div>
            </motion.div>

            {/* Header / Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
            >
                <LibraryHeader
                    filters={filters}
                    setFilters={setFilters}
                    resetFilters={resetFilters}
                    hasActiveFilters={hasActiveFilters}
                    activeFilterCount={activeFilterCount}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    totalCount={totalCount}
                    selectedIds={selectedIds}
                    filteredIds={filteredBookmarks.map(b => b.id)}
                    uniqueDomains={uniqueDomains}
                    uniqueTags={uniqueTags}
                    onSelectAll={isAllSelected ? clearSelection : selectAll}
                    onClearSelection={clearSelection}
                />
            </motion.div>

            {/* Content */}
            {paginatedBookmarks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface">
                        <Library className="h-12 w-12 text-foreground/30" />
                    </div>
                    <h3 className="font-display text-xl font-bold">No bookmarks found</h3>
                    <p className="mt-2 max-w-xs text-foreground/60">
                        {hasActiveFilters
                            ? "Try adjusting your filters to see more results."
                            : "Start saving bookmarks to build your library."}
                    </p>
                    {hasActiveFilters && (
                        <Button className="mt-6" variant="secondary" onClick={resetFilters}>
                            Clear All Filters
                        </Button>
                    )}
                </motion.div>
            ) : viewMode === "grid" ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {paginatedBookmarks.map((bookmark, index) => (
                        <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            index={index}
                            isSelected={isSelected(bookmark.id)}
                            onSelect={toggleSelection}
                            selectionMode={selectedIds.length > 0}
                        />
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                >
                    <BookmarkTable
                        bookmarks={paginatedBookmarks}
                        selectedIds={selectedIds}
                        onSelect={toggleSelection}
                        onSelectAll={isAllSelected ? clearSelection : selectAll}
                        isAllSelected={isAllSelected}
                        selectionMode={selectedIds.length > 0}
                    />
                </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-border bg-surface p-4"
                >
                    {/* Items per page */}
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <span>Show</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="rounded-lg border-2 border-border bg-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
                        >
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span>per page</span>
                    </div>

                    {/* Page Info */}
                    <span className="text-sm text-foreground/60">
                        Page {currentPage} of {totalPages} • {totalCount} total
                    </span>

                    {/* Prev/Next */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 rounded-lg border-2 border-border bg-surface px-3 py-1.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Prev
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 rounded-lg border-2 border-border bg-surface px-3 py-1.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Bulk Toolbar */}
            <BulkToolbar
                selectedIds={selectedIds}
                onClear={clearSelection}
                type="bookmarks"
            />
        </div>
    );
}
