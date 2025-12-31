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
    Eye
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, useBookmarks } from "@/hooks/useBookmarks";
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
    selectionMode = false
}: BookmarkCardProps) {
    const { toggleFavorite, removeBookmark } = useBookmarks();
    const [editOpen, setEditOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Format Relative Time
    const timeAgo = formatDistanceToNow(bookmark.createdAt, { addSuffix: true })
        .replace("about ", "")
        .replace("less than a minute", "Just now");

    // Favicon Generator (Google API)
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`;

    const handleCardClick = () => {
        if (selectionMode && onSelect) {
            onSelect(bookmark.id);
            return;
        }
        window.open(bookmark.url, "_blank");
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(bookmark.id);
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(bookmark.id);
        toast.success(bookmark.isFavorite ? "Removed from favorites" : "Added to favorites ❤️");
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeBookmark(bookmark.id);
        toast.success("Bookmark deleted 🗑️");
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-surface transition-all hover:shadow-brutal-md hover:-translate-y-1"
            >
                {/* --- 1. COVER IMAGE SECTION --- */}
                <div
                    className="relative aspect-[1.6/1] w-full overflow-hidden bg-accent-mint/20 cursor-pointer"
                    onClick={handleCardClick}
                >
                    {/* Selection Checkbox - Clean minimal style */}
                    {onSelect && (
                        <div
                            onClick={handleCheckboxClick}
                            className={cn(
                                "absolute left-3 top-3 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border-2 transition-all",
                                isSelected
                                    ? "border-primary bg-primary text-white shadow-brutal-sm"
                                    : "border-white bg-white/90 opacity-0 group-hover:opacity-100",
                                selectionMode && "opacity-100"
                            )}
                        >
                            {isSelected && <Check className="h-4 w-4" />}
                        </div>
                    )}

                    {/* Image */}
                    <img
                        src={imageError ? `https://ui-avatars.com/api/?name=${bookmark.domain}&background=C4B5FD&color=6366F1` : bookmark.coverImage}
                        alt={bookmark.title}
                        onError={() => setImageError(true)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* --- 2. CONTENT SECTION --- */}
                <div className="flex flex-1 flex-col p-4 cursor-pointer" onClick={handleCardClick}>

                    {/* Meta: Favicon & Domain */}
                    <div className="mb-2 flex items-center gap-2">
                        <img
                            src={faviconUrl}
                            alt=""
                            className="h-4 w-4 rounded-sm"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                        <span className="text-xs font-medium text-foreground/50 truncate max-w-[150px]">
                            {bookmark.domain}
                        </span>
                        <span className="text-[10px] text-foreground/30">•</span>
                        <span className="text-[10px] text-foreground/50">{bookmark.readingTime}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-1 font-display text-base font-bold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {bookmark.title}
                    </h3>

                    {/* Tags */}
                    <div className="mb-4 flex-1">
                        {bookmark.tags && bookmark.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {bookmark.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag.id || tag.label}
                                        className={cn(
                                            "text-[11px] px-2 py-0.5 rounded-full font-semibold border border-border/50",
                                            tag.color || "bg-accent-mint"
                                        )}
                                    >
                                        {tag.label}
                                    </span>
                                ))}
                                {bookmark.tags.length > 3 && (
                                    <span className="text-[11px] px-2 py-0.5 text-foreground/40 font-medium">
                                        +{bookmark.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-foreground/40 italic mt-1">No tags</p>
                        )}
                    </div>

                    {/* --- 3. FOOTER ACTIONS --- */}
                    <div className="mt-auto flex items-center justify-between border-t border-dashed border-border/30 pt-3">
                        <span className="text-[11px] font-medium text-foreground/40">
                            {timeAgo}
                        </span>

                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            {/* External Link */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(bookmark.url, "_blank");
                                }}
                                className="rounded-lg p-1.5 text-foreground/50 hover:bg-accent-sky/30 hover:text-primary transition-colors"
                                title="Open Link"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </button>

                            {/* Edit Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditOpen(true);
                                }}
                                className="rounded-lg p-1.5 text-foreground/50 hover:bg-accent-lavender/30 hover:text-primary transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>

                            {/* Dropdown Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <button className="rounded-lg p-1.5 text-foreground/50 hover:bg-secondary/50 hover:text-primary outline-none focus:ring-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(bookmark.url, '_blank'); }}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Site
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleFavorite}>
                                        <Heart className={cn("mr-2 h-4 w-4", bookmark.isFavorite ? "fill-accent-coral text-accent-coral" : "")} />
                                        {bookmark.isFavorite ? "Unfavorite" : "Add to Favorites"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditOpen(true); }}>
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleDelete} className="text-accent-coral focus:text-accent-coral focus:bg-accent-coral/10">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Edit Modal */}
            <EditBookmarkModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                bookmark={bookmark}
            />
        </>
    );
}