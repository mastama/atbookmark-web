"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Folder as FolderIcon, CheckSquare, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useOrganization, FolderColor } from "@/hooks/useOrganization";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useBulkSelect } from "@/hooks/useBulkSelect";
import { EmptyFolderView } from "@/components/dashboard/EmptyFolderView";
import { BookmarkCard } from "@/components/dashboard/BookmarkCard";
import { BulkToolbar } from "@/components/bulk/BulkToolbar";
import { AddBookmarkModal } from "@/components/modals/AddBookmarkModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const colorClasses: Record<FolderColor, string> = {
    mint: "text-green-600 bg-accent-mint",
    lavender: "text-purple-500 bg-accent-lavender",
    coral: "text-rose-500 bg-accent-coral",
    sky: "text-sky-500 bg-accent-sky",
    yellow: "text-amber-500 bg-secondary",
    gray: "text-gray-500 bg-gray-200",
};

export default function FolderDetailPage() {
    const params = useParams();
    const folderId = params.id as string;
    const { getFolderById, folders, getChildFolders } = useOrganization();
    const { getBookmarksByFolder } = useBookmarks();
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Handle "inbox" as a special slug - look up by name for system Inbox folder
    const folder = folderId === "inbox"
        ? folders.find(f => f.name === "Inbox" && f.type === "system")
        : getFolderById(folderId);

    // Get bookmarks using the actual folder ID (for inbox, use the found folder's ID)
    const actualFolderId = folder?.id || folderId;
    const folderBookmarks = getBookmarksByFolder(actualFolderId);
    const subFolders = folder ? getChildFolders(folder.id) : [];

    const {
        selectedIds,
        isSelected,
        toggleSelection,
        selectAll,
        clearSelection,
        isSelectionMode,
        selectedCount,
    } = useBulkSelect();

    if (!folder) {
        return (
            <div className="mx-auto max-w-5xl pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface">
                        <FolderIcon className="h-12 w-12 text-foreground/30" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Folder not found</h3>
                    <p className="mt-2 text-foreground/60">
                        This folder doesn&apos;t exist or has been deleted.
                    </p>
                    <Link
                        href="/dashboard/folders"
                        className="mt-6 flex items-center gap-2 text-primary hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Folders
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl pb-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Link
                    href="/dashboard/folders"
                    className="mb-4 inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Folders
                </Link>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className={cn(
                                "flex h-14 w-14 items-center justify-center rounded-xl border-2 border-border",
                                colorClasses[folder.color]
                            )}
                        >
                            <FolderIcon className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="font-display text-3xl font-bold">{folder.name}</h1>
                            <p className="text-foreground/60">
                                {folderBookmarks.length} bookmark{folderBookmarks.length !== 1 ? "s" : ""}
                                {subFolders.length > 0 && ` • ${subFolders.length} sub-folder${subFolders.length !== 1 ? "s" : ""}`}
                            </p>
                        </div>
                    </div>

                    {/* Select All Button */}
                    {folderBookmarks.length > 0 && (
                        <Button
                            variant={isSelectionMode ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() =>
                                isSelectionMode
                                    ? clearSelection()
                                    : selectAll(folderBookmarks)
                            }
                        >
                            <CheckSquare className="mr-2 h-4 w-4" />
                            {isSelectionMode ? `${selectedCount} selected` : "Select"}
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Sub-folders Section */}
            {subFolders.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground/50">
                        Sub-folders
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {subFolders.map((sub) => (
                            <Link
                                key={sub.id}
                                href={`/dashboard/folder/${sub.id}`}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg border-2 border-border px-3 py-2 text-sm font-medium shadow-brutal-sm hover:shadow-brutal-md hover:-translate-y-0.5 transition-all",
                                    colorClasses[sub.color]
                                )}
                            >
                                <FolderIcon className="h-4 w-4" />
                                {sub.name}
                                <ChevronRight className="h-3 w-3 opacity-50" />
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Content */}
            {folderBookmarks.length === 0 && subFolders.length === 0 ? (
                <EmptyFolderView
                    folderName={folder.name}
                    onAddBookmark={() => setAddModalOpen(true)}
                />
            ) : folderBookmarks.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
                    <p className="text-foreground/50">No bookmarks in this folder yet.</p>
                    <Button className="mt-4" onClick={() => setAddModalOpen(true)}>
                        Add Bookmark
                    </Button>
                </div>
            ) : (
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                    {folderBookmarks.map((bookmark, index) => (
                        <div key={bookmark.id} className="mb-4 break-inside-avoid">
                            <BookmarkCard
                                bookmark={bookmark}
                                index={index}
                                isSelected={isSelected(bookmark.id)}
                                onSelect={toggleSelection}
                                selectionMode={isSelectionMode}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Bulk Toolbar */}
            <BulkToolbar
                selectedIds={selectedIds}
                onClear={clearSelection}
                type="bookmarks"
            />

            {/* Add Modal */}
            <AddBookmarkModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
        </div>
    );
}
