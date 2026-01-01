"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, Search, X, Sparkles, PackageOpen, ArchiveRestore, Trash2 } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkCard } from "@/components/dashboard/BookmarkCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ArchivesPage() {
    const { getArchivedBookmarks, restoreBookmarks, trashBookmarks } = useBookmarks();
    const archivedBookmarks = getArchivedBookmarks();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showProBanner, setShowProBanner] = useState(true);

    // Filter by search
    const filteredBookmarks = archivedBookmarks.filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleRestoreSelected = () => {
        if (selectedIds.length === 0) return;
        restoreBookmarks(selectedIds);
        toast.success(`Restored ${selectedIds.length} item(s)`);
        setSelectedIds([]);
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Permanently delete ${selectedIds.length} item(s)? This cannot be undone.`)) {
            trashBookmarks(selectedIds);
            toast.success(`Deleted ${selectedIds.length} item(s)`);
            setSelectedIds([]);
        }
    };

    const selectionMode = selectedIds.length > 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border-2 border-border">
                        <Archive className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold">Archives</h1>
                        <p className="text-sm text-foreground/60">
                            Items here are hidden from your main library.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pro Banner */}
            <AnimatePresence>
                {showProBanner && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent-lavender/10 p-4"
                    >
                        <button
                            onClick={() => setShowProBanner(false)}
                            className="absolute right-3 top-3 text-foreground/40 hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-semibold text-foreground">
                                    ✨ Pro Tip: Set up Auto-Archive
                                </p>
                                <p className="text-sm text-foreground/60">
                                    Keep your library fresh by automatically archiving items older than 90 days.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="Search archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border-2 border-border bg-surface py-2.5 pl-10 pr-10 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Bulk Actions (visible when items selected) */}
                {selectionMode && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground/60">
                            {selectedIds.length} selected
                        </span>
                        <Button size="sm" onClick={handleRestoreSelected}>
                            <ArchiveRestore className="mr-2 h-4 w-4" />
                            Restore
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleDeleteSelected} className="text-red-600 hover:bg-red-50">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Forever
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                            Clear
                        </Button>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="text-sm text-foreground/60">
                {filteredBookmarks.length} archived item{filteredBookmarks.length !== 1 ? "s" : ""}
                {searchQuery && " (filtered)"}
            </div>

            {/* Content */}
            {filteredBookmarks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                        <PackageOpen className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        {searchQuery ? "No matches found" : "Clean slate!"}
                    </h3>
                    <p className="text-foreground/60 max-w-sm">
                        {searchQuery
                            ? "Try adjusting your search query."
                            : "No archived items yet. Archive bookmarks you want to keep but don't need daily access to."}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredBookmarks.map((bookmark, index) => (
                        <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            index={index}
                            isSelected={selectedIds.includes(bookmark.id)}
                            onSelect={handleSelect}
                            selectionMode={selectionMode}
                            isArchivedView={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
