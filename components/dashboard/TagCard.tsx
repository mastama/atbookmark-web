"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoreVertical, Trash2, Pin, Check } from "lucide-react";
import { Tag, FolderColor, useOrganization } from "@/hooks/useOrganization";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TagCardProps {
    tag: Tag;
    index: number;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    selectionMode?: boolean;
}

const colorClasses: Record<FolderColor, string> = {
    mint: "bg-accent-mint",
    lavender: "bg-accent-lavender",
    coral: "bg-accent-coral",
    sky: "bg-accent-sky",
    yellow: "bg-secondary",
    gray: "bg-gray-200",
};

export function TagCard({
    tag,
    index,
    isSelected = false,
    onSelect,
    selectionMode = false
}: TagCardProps) {
    const { removeTag, toggleTagPin } = useOrganization();
    const { getBookmarkCountByTag, removeTagsFromBookmarks } = useBookmarks();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const usageCount = getBookmarkCountByTag(tag.name);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = () => {
        // Cascade delete: remove tag from all bookmarks first (pass as array)
        removeTagsFromBookmarks([tag.name]);
        // Then remove the tag itself
        removeTag(tag.id);
        toast.success(`Deleted "${tag.name}"`);
        setMenuOpen(false);
    };

    const handlePin = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTagPin(tag.id);
        toast.success(tag.isPinned ? `Unpinned "${tag.name}"` : `Pinned "${tag.name}" ⭐`);
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.(tag.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className="relative group"
        >
            <Link
                href={`/dashboard/tag/${tag.id}`}
                className={cn(
                    "inline-flex items-center gap-2 rounded-full border-2 border-border px-4 py-2 font-medium shadow-brutal-sm hover:shadow-brutal-md hover:-translate-y-0.5 transition-all",
                    colorClasses[tag.color],
                    isSelected && "ring-2 ring-primary ring-offset-2"
                )}
            >
                {/* Checkbox (visible on hover or in selection mode) */}
                {onSelect && (
                    <button
                        onClick={handleCheckboxClick}
                        className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border-2 transition-all mr-1",
                            isSelected
                                ? "bg-primary border-primary"
                                : "border-gray-400 bg-white opacity-0 group-hover:opacity-100",
                            selectionMode && "opacity-100"
                        )}
                    >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                    </button>
                )}

                {tag.name}

                {/* Usage Count Badge */}
                {usageCount > 0 && (
                    <span className="ml-1 text-xs opacity-60">
                        ({usageCount})
                    </span>
                )}
            </Link>

            {/* Pin Button */}
            <button
                onClick={handlePin}
                className={cn(
                    "absolute -left-1 -top-1 rounded-full border border-border bg-surface p-1 shadow-sm transition-all",
                    tag.isPinned
                        ? "opacity-100 text-primary"
                        : "opacity-0 group-hover:opacity-100 hover:text-primary"
                )}
                title={tag.isPinned ? "Unpin tag" : "Pin tag"}
            >
                <Pin
                    className={cn(
                        "h-3 w-3 transition-transform",
                        tag.isPinned && "fill-current rotate-45"
                    )}
                />
            </button>

            {/* More Menu */}
            <div className="relative inline-block" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setMenuOpen(!menuOpen);
                    }}
                    className="absolute -right-2 -top-2 rounded-full border border-border bg-surface p-1 opacity-0 group-hover:opacity-100 hover:bg-accent-coral/20 transition-opacity shadow-sm"
                >
                    <MoreVertical className="h-3 w-3" />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 top-6 z-10 w-28 rounded-xl border-2 border-border bg-surface p-1 shadow-brutal-md">
                        <button
                            onClick={handleDelete}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-accent-coral hover:bg-accent-coral/10"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
