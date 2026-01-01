"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
    ExternalLink,
    MoreHorizontal,
    Edit2,
    Trash2,
    Heart,
    Check,
    Folder,
    Circle,
} from "lucide-react";
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
} from "@/components/ui/dropdown-menu";

interface BookmarkTableProps {
    bookmarks: Bookmark[];
    selectedIds: string[];
    onSelect: (id: string) => void;
    onSelectAll: () => void;
    isAllSelected: boolean;
    selectionMode?: boolean;
}

export function BookmarkTable({
    bookmarks,
    selectedIds,
    onSelect,
    onSelectAll,
    isAllSelected,
    selectionMode = false,
}: BookmarkTableProps) {
    const { toggleFavorite, removeBookmark } = useBookmarks();
    const { getFolderById } = useOrganization();
    const [editBookmark, setEditBookmark] = useState<Bookmark | null>(null);

    const isSelected = (id: string) => selectedIds.includes(id);

    const handleDelete = (bookmark: Bookmark) => {
        removeBookmark(bookmark.id);
        toast.success("Bookmark deleted 🗑️");
    };

    return (
        <>
            <div className="overflow-hidden rounded-xl border-2 border-border bg-surface">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-border bg-background/50">
                            {/* Select All Checkbox */}
                            <th className="w-10 p-3">
                                <button
                                    onClick={onSelectAll}
                                    className={cn(
                                        "flex h-5 w-5 items-center justify-center rounded border-2 transition-all",
                                        isAllSelected
                                            ? "border-primary bg-primary text-white"
                                            : "border-border hover:border-primary"
                                    )}
                                    title={isAllSelected ? "Deselect all" : "Select all"}
                                >
                                    {isAllSelected && <Check className="h-3 w-3" />}
                                </button>
                            </th>
                            <th className="w-6 p-3">
                                <span className="sr-only">Status</span>
                            </th>
                            <th className="p-3 text-left text-xs font-bold uppercase tracking-wider text-foreground/60">
                                Title
                            </th>
                            <th className="hidden p-3 text-left text-xs font-bold uppercase tracking-wider text-foreground/60 md:table-cell">
                                Folder
                            </th>
                            <th className="hidden p-3 text-left text-xs font-bold uppercase tracking-wider text-foreground/60 lg:table-cell">
                                Tags
                            </th>
                            <th className="hidden p-3 text-left text-xs font-bold uppercase tracking-wider text-foreground/60 sm:table-cell">
                                Added
                            </th>
                            <th className="w-20 p-3 text-right text-xs font-bold uppercase tracking-wider text-foreground/60">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookmarks.map((bookmark) => {
                            const folder = getFolderById(bookmark.folderId);
                            const timeAgo = formatDistanceToNow(bookmark.createdAt, {
                                addSuffix: true,
                            }).replace("about ", "");

                            // Email-client style: check isRead status
                            const isRead = (bookmark as any).isRead === true;

                            return (
                                <tr
                                    key={bookmark.id}
                                    className={cn(
                                        "border-b border-border/50 transition-colors",
                                        isSelected(bookmark.id) && "bg-primary/5",
                                        // Email-client style: unread = white bg, read = gray bg
                                        isRead
                                            ? "bg-foreground/5 hover:bg-foreground/10"
                                            : "bg-surface hover:bg-accent-mint/10"
                                    )}
                                >
                                    {/* Checkbox */}
                                    <td className="p-3">
                                        <button
                                            onClick={() => onSelect(bookmark.id)}
                                            className={cn(
                                                "flex h-5 w-5 items-center justify-center rounded border-2 transition-all",
                                                isSelected(bookmark.id)
                                                    ? "border-primary bg-primary text-white"
                                                    : "border-border hover:border-primary"
                                            )}
                                        >
                                            {isSelected(bookmark.id) && (
                                                <Check className="h-3 w-3" />
                                            )}
                                        </button>
                                    </td>

                                    {/* Unread Indicator (Blue Dot) */}
                                    <td className="p-3">
                                        {!isRead && (
                                            <Circle className="h-2 w-2 fill-primary text-primary" />
                                        )}
                                    </td>

                                    {/* Title & Domain */}
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {/* Favicon */}
                                            <img
                                                src={`https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`}
                                                alt=""
                                                className="h-5 w-5 rounded"
                                                onError={(e) =>
                                                    (e.currentTarget.style.display = "none")
                                                }
                                            />
                                            <div className="min-w-0 flex-1">
                                                <a
                                                    href={bookmark.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={cn(
                                                        "block truncate transition-colors hover:text-primary",
                                                        // Email-client style: unread = bold
                                                        isRead
                                                            ? "text-foreground/70"
                                                            : "font-semibold text-foreground"
                                                    )}
                                                >
                                                    {bookmark.title}
                                                </a>
                                                <span className="text-xs text-foreground/50">
                                                    {bookmark.domain}
                                                </span>
                                            </div>
                                            {bookmark.isFavorite && (
                                                <Heart className="h-4 w-4 fill-accent-coral text-accent-coral" />
                                            )}
                                        </div>
                                    </td>

                                    {/* Folder */}
                                    <td className="hidden p-3 md:table-cell">
                                        {folder && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-sky/20 px-2 py-0.5 text-xs font-medium text-foreground/80">
                                                <Folder className="h-3 w-3" />
                                                {folder.name}
                                            </span>
                                        )}
                                    </td>

                                    {/* Tags */}
                                    <td className="hidden p-3 lg:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {bookmark.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag.id || tag.label}
                                                    className={cn(
                                                        "rounded-full px-2 py-0.5 text-[10px] font-semibold border border-border/30",
                                                        tag.color || "bg-accent-mint"
                                                    )}
                                                >
                                                    {tag.label}
                                                </span>
                                            ))}
                                            {bookmark.tags.length > 2 && (
                                                <span className="text-[10px] text-foreground/40">
                                                    +{bookmark.tags.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Date Added */}
                                    <td className="hidden p-3 text-xs text-foreground/50 sm:table-cell">
                                        {timeAgo}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => window.open(bookmark.url, "_blank")}
                                                className="rounded-lg p-1.5 text-foreground/50 hover:bg-accent-sky/20 hover:text-primary transition-colors"
                                                title="Open"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="rounded-lg p-1.5 text-foreground/50 hover:bg-secondary/50 hover:text-primary outline-none">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            toggleFavorite(bookmark.id);
                                                            toast.success(
                                                                bookmark.isFavorite
                                                                    ? "Removed from favorites"
                                                                    : "Added to favorites ❤️"
                                                            );
                                                        }}
                                                    >
                                                        <Heart
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                bookmark.isFavorite &&
                                                                "fill-accent-coral text-accent-coral"
                                                            )}
                                                        />
                                                        {bookmark.isFavorite ? "Unfavorite" : "Favorite"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setEditBookmark(bookmark)}
                                                    >
                                                        <Edit2 className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(bookmark)}
                                                        className="text-accent-coral focus:text-accent-coral focus:bg-accent-coral/10"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {bookmarks.length === 0 && (
                    <div className="py-12 text-center text-foreground/50">
                        No bookmarks found matching your filters.
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editBookmark && (
                <EditBookmarkModal
                    isOpen={!!editBookmark}
                    onClose={() => setEditBookmark(null)}
                    bookmark={editBookmark}
                />
            )}
        </>
    );
}
