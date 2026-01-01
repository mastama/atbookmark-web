"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
    Search,
    LayoutGrid,
    List,
    Filter,
    X,
    Calendar as CalendarIcon,
    Folder,
    Hash,
    Globe,
    Heart,
    BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { LibraryCleanupMenu } from "./LibraryCleanupMenu";
import { useOrganization } from "@/hooks/useOrganization";
import {
    LibraryFilterState,
    DatePreset,
    StatusFilter,
    ViewMode,
    DateRange,
} from "@/hooks/useLibraryLogic";
import { cn } from "@/lib/utils";

interface LibraryHeaderProps {
    filters: LibraryFilterState;
    setFilters: (filters: Partial<LibraryFilterState>) => void;
    resetFilters: () => void;
    hasActiveFilters: boolean;
    activeFilterCount: number;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    totalCount: number;
    selectedIds: string[];
    filteredIds: string[];
    uniqueDomains: string[];
    uniqueTags: { id: string; name: string }[];
    onSelectAll: () => void;
    onClearSelection: () => void;
}

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "month", label: "This Month" },
    { value: "custom", label: "Custom Range" },
];

export function LibraryHeader({
    filters,
    setFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
    viewMode,
    setViewMode,
    totalCount,
    selectedIds,
    filteredIds,
    uniqueDomains,
    uniqueTags,
    onSelectAll,
    onClearSelection,
}: LibraryHeaderProps) {
    // Derive counts from arrays
    const selectedCount = selectedIds.length;
    const filteredCount = filteredIds.length;
    const { folders } = useOrganization();
    const [filterOpen, setFilterOpen] = useState(false);
    const [dateRangeOpen, setDateRangeOpen] = useState(false);

    const customFolders = folders.filter((f) => f.type === "custom" || f.id === "inbox");

    // Get active filter labels for chips
    const getActiveFilterChips = () => {
        const chips: { key: string; label: string; onRemove: () => void }[] = [];

        if (filters.datePreset !== "all") {
            const preset = DATE_PRESETS.find((p) => p.value === filters.datePreset);
            chips.push({
                key: "date",
                label: `Date: ${preset?.label || filters.datePreset}`,
                onRemove: () => setFilters({ datePreset: "all", dateRange: {} }),
            });
        }

        if (filters.folderId !== "all") {
            const folder = folders.find((f) => f.id === filters.folderId);
            chips.push({
                key: "folder",
                label: `Folder: ${folder?.name || filters.folderId}`,
                onRemove: () => setFilters({ folderId: "all" }),
            });
        }

        if (filters.tagId !== "all") {
            chips.push({
                key: "tag",
                label: `Tag: ${filters.tagId}`,
                onRemove: () => setFilters({ tagId: "all" }),
            });
        }

        if (filters.domain !== "all") {
            chips.push({
                key: "domain",
                label: `Site: ${filters.domain}`,
                onRemove: () => setFilters({ domain: "all" }),
            });
        }

        return chips;
    };

    const activeChips = getActiveFilterChips();

    return (
        <div className="space-y-3">
            {/* Row 1: Main Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="Search bookmarks..."
                        value={filters.searchQuery}
                        onChange={(e) => setFilters({ searchQuery: e.target.value })}
                        className="w-full rounded-xl border-2 border-border bg-surface py-2.5 pl-10 pr-10 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                    {filters.searchQuery && (
                        <button
                            onClick={() => setFilters({ searchQuery: "" })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Quick Chips */}
                <div className="flex gap-2">
                    <button
                        onClick={() =>
                            setFilters({
                                status: filters.status === "unread" ? "all" : "unread",
                            })
                        }
                        className={cn(
                            "flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-all",
                            filters.status === "unread"
                                ? "border-primary bg-primary text-white"
                                : "border-border bg-surface hover:border-primary"
                        )}
                    >
                        <BookOpen className="h-4 w-4" />
                        Unread
                    </button>
                    <button
                        onClick={() =>
                            setFilters({
                                status: filters.status === "favorite" ? "all" : "favorite",
                            })
                        }
                        className={cn(
                            "flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-all",
                            filters.status === "favorite"
                                ? "border-accent-coral bg-accent-coral text-white"
                                : "border-border bg-surface hover:border-accent-coral"
                        )}
                    >
                        <Heart className="h-4 w-4" />
                        Favorites
                    </button>
                </div>

                {/* Filter Popover */}
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={activeFilterCount > 0 ? "secondary" : "ghost"}
                            size="sm"
                            className="gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="end">
                        <div className="space-y-4">
                            <h4 className="font-display font-bold">Filter Bookmarks</h4>

                            {/* Date Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-foreground/60">
                                    Date Added
                                </label>
                                <select
                                    value={filters.datePreset}
                                    onChange={(e) =>
                                        setFilters({ datePreset: e.target.value as DatePreset })
                                    }
                                    className="w-full rounded-lg border-2 border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                >
                                    {DATE_PRESETS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Custom Date Range */}
                                {filters.datePreset === "custom" && (
                                    <Popover open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
                                        <PopoverTrigger asChild>
                                            <button className="w-full flex items-center gap-2 rounded-lg border-2 border-border bg-surface px-3 py-2 text-sm text-left hover:border-primary">
                                                <CalendarIcon className="h-4 w-4 text-foreground/50" />
                                                {filters.dateRange.from ? (
                                                    <>
                                                        {format(filters.dateRange.from, "MMM d")}
                                                        {filters.dateRange.to &&
                                                            ` - ${format(filters.dateRange.to, "MMM d")}`}
                                                    </>
                                                ) : (
                                                    "Select date range"
                                                )}
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="range"
                                                selected={{
                                                    from: filters.dateRange.from,
                                                    to: filters.dateRange.to,
                                                }}
                                                onSelect={(range) => {
                                                    setFilters({
                                                        dateRange: {
                                                            from: range?.from,
                                                            to: range?.to,
                                                        },
                                                    });
                                                }}
                                                numberOfMonths={1}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>

                            {/* Folder Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-foreground/60 flex items-center gap-1">
                                    <Folder className="h-3 w-3" />
                                    Folder
                                </label>
                                <select
                                    value={filters.folderId}
                                    onChange={(e) => setFilters({ folderId: e.target.value })}
                                    className="w-full rounded-lg border-2 border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                >
                                    <option value="all">All Folders</option>
                                    {customFolders.map((folder) => (
                                        <option key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tag Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-foreground/60 flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    Tag
                                </label>
                                <select
                                    value={filters.tagId}
                                    onChange={(e) => setFilters({ tagId: e.target.value })}
                                    className="w-full rounded-lg border-2 border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                >
                                    <option value="all">All Tags</option>
                                    {uniqueTags.map((tag) => (
                                        <option key={tag.id} value={tag.name}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Domain Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-foreground/60 flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    Website
                                </label>
                                <select
                                    value={filters.domain}
                                    onChange={(e) => setFilters({ domain: e.target.value })}
                                    className="w-full rounded-lg border-2 border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                >
                                    <option value="all">All Websites</option>
                                    {uniqueDomains.slice(0, 20).map((domain) => (
                                        <option key={domain} value={domain}>
                                            {domain}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Reset */}
                            {hasActiveFilters && (
                                <button
                                    onClick={() => {
                                        resetFilters();
                                        setFilterOpen(false);
                                    }}
                                    className="w-full text-sm text-accent-coral hover:underline"
                                >
                                    Reset All Filters
                                </button>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Cleanup Menu */}
                <LibraryCleanupMenu
                    selectedIds={selectedIds}
                    filteredIds={filteredIds}
                    onClearSelection={onClearSelection}
                />

                {/* View Toggle */}
                <div className="flex rounded-xl border-2 border-border overflow-hidden">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                            "p-2 transition-colors",
                            viewMode === "grid"
                                ? "bg-primary text-white"
                                : "bg-surface hover:bg-accent-mint/20"
                        )}
                        title="Grid View"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={cn(
                            "p-2 transition-colors border-l-2 border-border",
                            viewMode === "table"
                                ? "bg-primary text-white"
                                : "bg-surface hover:bg-accent-mint/20"
                        )}
                        title="Table View"
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Row 2: Active Filter Chips */}
            {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    {activeChips.map((chip) => (
                        <span
                            key={chip.key}
                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                            {chip.label}
                            <button
                                onClick={chip.onRemove}
                                className="rounded-full hover:bg-primary/20 p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    <button
                        onClick={resetFilters}
                        className="text-xs text-foreground/50 hover:text-foreground"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* Row 3: Results Summary */}
            <div className="flex items-center justify-between text-sm text-foreground/60">
                <span>
                    {filteredCount} bookmark{filteredCount !== 1 ? "s" : ""}
                    {hasActiveFilters && " (filtered)"}
                </span>
                {selectedCount > 0 && (
                    <span className="font-medium text-primary">
                        {selectedCount} selected
                        <button
                            onClick={onClearSelection}
                            className="ml-2 text-foreground/50 hover:text-foreground"
                        >
                            (clear)
                        </button>
                    </span>
                )}
            </div>
        </div>
    );
}
