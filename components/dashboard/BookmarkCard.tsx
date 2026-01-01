"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    MoreHorizontal,
    ExternalLink,
    Edit2,
    Trash2,
    Heart,
    Check,
    Eye,
    CheckCircle,
    Archive,
    ArchiveRestore,
    FolderInput,
    Folder as FolderIcon,
    XCircle,
    Copy
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, useBookmarks } from "@/hooks/useBookmarks";
import { useOrganization } from "@/hooks/useOrganization";
import { EditBookmarkModal } from "@/components/modals/EditBookmarkModal";
import { ProModal } from "@/components/modals/ProModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

interface BookmarkCardProps {
    bookmark: Bookmark;
    index: number;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    selectionMode?: boolean;
    isArchivedView?: boolean;
}

export function BookmarkCard({
    bookmark,
    index,
    isSelected = false,
    onSelect,
    selectionMode = false,
    isArchivedView = false,
}: BookmarkCardProps) {
    const {
        toggleFavorite,
        removeBookmark,
        moveBookmarks,
        updateBookmark,
        restoreBookmarks,
        archiveBookmarks,
        getArchivedCount,
    } = useBookmarks();

    const { folders, isPro } = useOrganization();

    const [proModalOpen, setProModalOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const currentFolder = folders.find((f) => f.id === bookmark.folderId);
    const currentFolderName = currentFolder ? currentFolder.name : "Inbox";
    let timeAgo = "Just now";
    try {
        timeAgo = formatDistanceToNow(bookmark.createdAt || Date.now(), {
            addSuffix: true,
        })
            .replace("about ", "")
            .replace("less than a minute", "Just now");
    } catch (e) { }

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`;

    // Helper: Truncate URL agar rapi
    const displayUrl = bookmark.url
        .replace(/^https?:\/\/(www\.)?/, "")
        .substring(0, 30) + (bookmark.url.length > 30 ? "..." : "");

    /* ----------------------------------
     * Actions
     * ---------------------------------- */
    const handleOpenLink = () => window.open(bookmark.url, "_blank");

    const handleMoveToFolder = (targetFolderId: string, targetFolderName: string) => {
        moveBookmarks([bookmark.id], targetFolderId);
        toast.success(`Moved to ${targetFolderName}`);
    };

    const FREE_ARCHIVE_LIMIT = 5;

    const handleArchive = () => {
        // Check archive limit for Free users
        if (!isPro && getArchivedCount() >= FREE_ARCHIVE_LIMIT) {
            toast.error("Free plan limit: 5 archived items max. Upgrade to Pro for unlimited!", {
                icon: "🔒",
                duration: 4000,
            });
            setProModalOpen(true);
            return;
        }
        archiveBookmarks([bookmark.id]);
        toast.success("Moved to Archive");
    };

    const handleRestore = () => {
        restoreBookmarks([bookmark.id]);
        toast.success("Restored from Archive");
    };

    const handleMarkAsRead = () => {
        // @ts-ignore
        updateBookmark(bookmark.id, { isRead: true });
        toast.success("Marked as read");
    };

    const handleMarkAsUnread = () => {
        // @ts-ignore
        updateBookmark(bookmark.id, { isRead: false });
        toast("Marked as unread");
    };

    const copyLink = () => {
        navigator.clipboard.writeText(bookmark.url);
        toast.success("Link copied to clipboard");
    }
    // @ts-ignore
    const isRead = bookmark.isRead === true;


    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                    "group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white transition-all hover:shadow-brutal-sm",
                    isSelected
                        ? "border-primary ring-1 ring-primary"
                        : "border-border",
                    bookmark.isRead && "opacity-75 bg-gray-50"
                )}
            >
                {/* ================= COVER IMAGE ================= */}
                <div
                    className="relative aspect-[1.6/1] w-full overflow-hidden bg-gray-50 cursor-pointer"
                    onClick={() =>
                        selectionMode && onSelect
                            ? onSelect(bookmark.id)
                            : handleOpenLink()
                    }
                >
                    {/* Checkbox Selection */}
                    {onSelect && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(bookmark.id);
                            }}
                            className={cn(
                                // 1. Base Classes (Selalu ada)
                                "absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm transition-all",

                                // 2. Logika Utama
                                isSelected
                                    ? // JIKA TERPILIH (Prioritas Tertinggi):
                                    // Selalu Biru, teks putih, opacity penuh.
                                    "border-primary bg-primary text-white opacity-100"
                                    : // JIKA TIDAK TERPILIH:
                                    // Cek apakah sedang dalam "Selection Mode"?
                                    selectionMode
                                        ? "opacity-100 border-gray-300 bg-white" // Ya Mode Seleksi: Lingkaran putih terlihat jelas
                                        : "border-white bg-white/50 opacity-0 group-hover:opacity-100" // Bukan Mode Seleksi: Lingkaran transparan, muncul saat hover
                            )}
                        >
                            {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                    )}

                    {/* Folder Badge (ALWAYS VISIBLE) */}
                    <div className="absolute right-3 top-3 z-10">
                        <span className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm border border-white/10">
                            <FolderIcon className="h-3 w-3 opacity-80" />
                            <span className="truncate max-w-[80px]">{currentFolderName}</span>
                        </span>
                    </div>

                    {/* Read Indicator */}
                    {bookmark.isRead && !isArchivedView && (
                        <div className="absolute left-3 bottom-3 z-10 flex items-center gap-1 rounded-full bg-green-100 p-1 shadow-sm border border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-semibold text-green-600">READ</span>
                        </div>
                    )}

                    {/* Archived Badge */}
                    {isArchivedView && (
                        <div className="absolute left-3 bottom-3 z-10 flex items-center gap-1 rounded-full bg-gray-200 p-1 shadow-sm border border-gray-300">
                            <Archive className="h-4 w-4 text-gray-600" />
                            <span className="text-xs font-semibold text-gray-600">ARCHIVED</span>
                        </div>
                    )}

                    <img
                        src={
                            imageError
                                ? `https://ui-avatars.com/api/?name=${bookmark.domain}&background=random&color=fff`
                                : bookmark.coverImage
                        }
                        alt={bookmark.title}
                        onError={() => setImageError(true)}
                        className={cn(
                            "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                            (isRead || isArchivedView) && "grayscale"
                        )}
                    />
                </div>

                {/* ================= CONTENT ================= */}
                <div className="flex flex-1 flex-col p-4">
                    {/* Meta: Favicon + Original URL Display (FIXED) */}
                    <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                        <img
                            src={faviconUrl}
                            className="h-4 w-4 rounded-sm"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <span className="truncate max-w-[200px] hover:text-primary transition-colors cursor-pointer" title={bookmark.url} onClick={(e) => { e.stopPropagation(); handleOpenLink() }}>
                            {displayUrl}
                        </span>
                    </div>

                    {/* Title */}
                    <h3
                        onClick={handleOpenLink}
                        className={cn(
                            "mb-1 font-display text-base font-bold leading-tight line-clamp-2 cursor-pointer transition-colors",
                            bookmark.isRead
                                ? "text-gray-500 line-through decoration-gray-300"
                                : "text-gray-900 hover:text-primary"
                        )}
                    >
                        {bookmark.title}
                    </h3>

                    {/* Tags */}
                    <div className="mb-4 flex-1">
                        <div className="flex flex-wrap gap-1 mt-2">
                            {bookmark.tags && bookmark.tags.length > 0 ? (
                                bookmark.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag.id || tag.label}
                                        className={cn(
                                            "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                                            tag.color ? tag.color.replace('text-', 'bg-opacity-10 border-opacity-20 text-') : "bg-gray-100 text-gray-600 border-gray-200"
                                        )}
                                        style={tag.color ? { backgroundColor: `var(--${tag.color}-50)` } : {}}
                                    >
                                        {tag.label}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] text-gray-400 italic">No tags</span>
                            )}
                        </div>
                    </div>

                    {/* ================= FOOTER ================= */}
                    <div className="mt-auto flex items-center justify-between border-t border-dashed border-gray-100 pt-3">
                        <span className="text-[11px] font-medium text-gray-400">
                            {timeAgo}
                        </span>

                        <div className="flex items-center gap-1">
                            {/* Open Link (DO NOT REMOVE) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenLink();
                                }}
                                className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </button>

                            {/* Favorite */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(bookmark.id);
                                }}
                                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <Heart
                                    className={cn(
                                        "h-4 w-4",
                                        bookmark.isFavorite && "fill-red-500 text-red-500"
                                    )}
                                />
                            </button>

                            {/* Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 outline-none">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-1">
                                    <DropdownMenuItem onClick={handleOpenLink} className="cursor-pointer">
                                        <Eye className="mr-2 h-4 w-4 text-gray-500" />
                                        View Details
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={copyLink} className="cursor-pointer">
                                        <Copy className="mr-2 h-4 w-4 text-gray-500" />
                                        Copy Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => toggleFavorite(bookmark.id)}
                                        className="cursor-pointer"
                                    >
                                        <Heart className={cn("mr-2 h-4 w-4", bookmark.isFavorite ? "fill-orange-500 text-orange-500" : "text-gray-500")} />
                                        {bookmark.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={isRead ? handleMarkAsUnread : handleMarkAsRead}
                                        className="cursor-pointer"
                                    >
                                        {isRead ? (
                                            <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                                        ) : (
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                        )}
                                        {isRead ? "Mark as Unread" : "Mark as Read"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="cursor-pointer">
                                            <FolderInput className="mr-2 h-4 w-4 text-gray-500" />
                                            Move to Folder
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="w-48 p-1 max-h-60 overflow-y-auto">
                                            {folders.map((f) => (
                                                <DropdownMenuItem
                                                    key={f.id}
                                                    onClick={() => handleMoveToFolder(f.id, f.name)}
                                                    className="cursor-pointer"
                                                >
                                                    <FolderIcon className="mr-2 h-3.5 w-3.5 text-gray-400" />
                                                    <span className="truncate">{f.name}</span>
                                                    {bookmark.folderId === f.id && (
                                                        <Check className="ml-auto h-3 w-3 text-primary" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                    <DropdownMenuItem
                                        onClick={() => setEditOpen(true)}
                                        className="cursor-pointer"
                                    >
                                        <Edit2 className="mr-2 h-4 w-4 text-gray-500" />
                                        Edit
                                    </DropdownMenuItem>
                                    {isArchivedView ? (
                                        <DropdownMenuItem onClick={handleRestore} className="cursor-pointer text-green-600">
                                            <ArchiveRestore className="mr-2 h-4 w-4" />
                                            Restore
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onClick={handleArchive} className="cursor-pointer">
                                            <Archive className="mr-2 h-4 w-4 text-gray-500" />
                                            Archive
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => removeBookmark(bookmark.id)}
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </motion.div>

            <EditBookmarkModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                bookmark={bookmark}
            />

            <ProModal
                isOpen={proModalOpen}
                onClose={() => setProModalOpen(false)}
            />
        </>
    );
}
