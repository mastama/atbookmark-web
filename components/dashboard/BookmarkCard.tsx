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
    FolderInput,
    Folder as FolderIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, useBookmarks } from "@/hooks/useBookmarks";
import { useOrganization } from "@/hooks/useOrganization";
import { EditBookmarkModal } from "@/components/modals/EditBookmarkModal";
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
}

export function BookmarkCard({
    bookmark,
    index,
    isSelected = false,
    onSelect,
    selectionMode = false,
}: BookmarkCardProps) {
    const {
        toggleFavorite,
        removeBookmark,
        moveBookmarks,
        updateBookmark,
    } = useBookmarks();

    const { folders } = useOrganization();

    const [editOpen, setEditOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const currentFolderName =
        folders.find((f) => f.id === bookmark.folderId)?.name || "Inbox";

    // Safely handle createdAt (fallback to current time if undefined)
    const createdTimestamp = bookmark.createdAt || Date.now();
    const timeAgo = formatDistanceToNow(createdTimestamp, {
        addSuffix: true,
    })
        .replace("about ", "")
        .replace("less than a minute", "Just now");

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`;

    /* ----------------------------------
     * Actions
     * ---------------------------------- */
    const handleOpenLink = () => window.open(bookmark.url, "_blank");

    const handleMoveToFolder = (folderId: string, folderName: string) => {
        moveBookmarks([bookmark.id], folderId);
        toast.success(`Moved to ${folderName}`);
    };

    const handleArchive = () => {
        updateBookmark(bookmark.id, { archived: true });
        toast.success("Archived");
    };

    const handleMarkAsRead = () => {
        updateBookmark(bookmark.id, { isRead: true });
        toast.success("Marked as read");
    };

    const handleMarkAsUnread = () => {
        updateBookmark(bookmark.id, { isRead: false });
        toast("Marked as unread");
    };

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
                    bookmark.isRead && "opacity-75"
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
                    {/* Selection */}
                    {onSelect && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(bookmark.id);
                            }}
                            className={cn(
                                "absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm transition-all",
                                isSelected
                                    ? "border-primary bg-primary text-white"
                                    : "border-white bg-white/50 opacity-0 group-hover:opacity-100",
                                selectionMode && "opacity-100"
                            )}
                        >
                            {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                    )}

                    {/* Folder Badge (ALWAYS VISIBLE) */}
                    <div className="absolute right-3 top-3 z-10">
                        <span className="flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                            <FolderIcon className="h-3 w-3 opacity-80" />
                            <span className="truncate max-w-[80px]">{currentFolderName}</span>
                        </span>
                    </div>

                    {/* Read Indicator */}
                    {bookmark.isRead && (
                        <div className="absolute left-3 bottom-3 flex items-center gap-1 rounded-full bg-green-500/90 px-2 py-0.5 text-[9px] font-bold text-white shadow">
                            <CheckCircle className="h-3 w-3" />
                            <span>READ</span>
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
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* ================= CONTENT ================= */}
                <div className="flex flex-1 flex-col p-4">
                    {/* Meta */}
                    <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                        <img
                            src={faviconUrl}
                            className="h-4 w-4 rounded-sm"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <span className="truncate font-medium opacity-80">
                            {bookmark.domain}
                        </span>
                    </div>

                    {/* Title */}
                    <h3
                        onClick={handleOpenLink}
                        className={cn(
                            "mb-1 font-display text-base font-bold leading-tight line-clamp-2 cursor-pointer transition-colors",
                            bookmark.isRead
                                ? "text-gray-500"
                                : "text-gray-900 hover:text-primary"
                        )}
                    >
                        {bookmark.title}
                    </h3>

                    {/* Tags */}
                    <div className="mb-4 flex-1">
                        <div className="flex flex-wrap gap-1 mt-2">
                            {bookmark.tags?.slice(0, 3).map((tag) => (
                                <span
                                    key={tag.id || tag.label}
                                    className="rounded-full border px-2 py-0.5 text-[10px] font-bold text-gray-600 bg-gray-100"
                                >
                                    {tag.label}
                                </span>
                            ))}
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
                                <DropdownMenuTrigger asChild>
                                    <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 p-1">
                                    <DropdownMenuItem onClick={handleOpenLink}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Lihat Detail
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => toggleFavorite(bookmark.id)}
                                    >
                                        <Heart className="mr-2 h-4 w-4" />
                                        {bookmark.isFavorite
                                            ? "Hapus dari Favorit"
                                            : "Tambah ke Favorit"}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={
                                            bookmark.isRead
                                                ? handleMarkAsUnread
                                                : handleMarkAsRead
                                        }
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                        {bookmark.isRead
                                            ? "Tandai Belum Dibaca"
                                            : "Tandai Sudah Dibaca"}
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <FolderInput className="mr-2 h-4 w-4" />
                                            Pindah ke Folder
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="max-h-60 overflow-y-auto">
                                            {folders.map((f) => (
                                                <DropdownMenuItem
                                                    key={f.id}
                                                    onClick={() =>
                                                        handleMoveToFolder(f.id, f.name)
                                                    }
                                                >
                                                    <FolderIcon className="mr-2 h-4 w-4" />
                                                    {f.name}
                                                    {bookmark.folderId === f.id && (
                                                        <Check className="ml-auto h-3 w-3 text-primary" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>

                                    <DropdownMenuItem
                                        onClick={() => setEditOpen(true)}
                                    >
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={handleArchive}>
                                        <Archive className="mr-2 h-4 w-4" />
                                        Arsipkan
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={() => removeBookmark(bookmark.id)}
                                        className="text-red-600 focus:bg-red-50"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus
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
        </>
    );
}
