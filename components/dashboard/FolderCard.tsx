"use client";

import { useState, useRef, useEffect, DragEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Folder as FolderIcon, MoreVertical, Pin, PinOff, Trash2, ChevronRight } from "lucide-react";
import { Folder, FolderColor, useOrganization } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FolderCardProps {
    folder: Folder;
    index: number;
    onDragStart?: (e: DragEvent, folder: Folder) => void;
    onDragOver?: (e: DragEvent) => void;
    onDrop?: (e: DragEvent, targetFolder: Folder) => void;
}

const colorClasses: Record<FolderColor, string> = {
    mint: "text-green-600 bg-accent-mint",
    lavender: "text-purple-500 bg-accent-lavender",
    coral: "text-rose-500 bg-accent-coral",
    sky: "text-sky-500 bg-accent-sky",
    yellow: "text-amber-500 bg-secondary",
    gray: "text-gray-500 bg-gray-200",
};

export function FolderCard({ folder, index, onDragStart, onDragOver, onDrop }: FolderCardProps) {
    const { togglePin, deleteFolder, getChildFolders } = useOrganization();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const childCount = getChildFolders(folder.id).length;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePin = () => {
        togglePin(folder.id);
        toast.success(folder.isPinned ? "Unpinned folder" : "Pinned folder 📌");
        setMenuOpen(false);
    };

    const handleDelete = () => {
        if (folder.type === "system") {
            toast.error("Cannot delete system folder");
            return;
        }
        deleteFolder(folder.id);
        toast.success(`Deleted "${folder.name}"`);
        setMenuOpen(false);
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        if (onDragStart) {
            onDragStart(e, folder);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
        if (onDragOver) {
            onDragOver(e);
        }
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (onDrop) {
            onDrop(e, folder);
        }
    };

    return (
        <div
            draggable={folder.type !== "system"}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                folder.type !== "system" && "cursor-grab active:cursor-grabbing",
                isDragOver && "ring-2 ring-primary ring-offset-2 rounded-2xl"
            )}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                <Link
                    href={`/dashboard/folder/${folder.id}`}
                    className={cn(
                        "group block rounded-2xl border-2 border-border bg-surface p-5 shadow-brutal-sm hover:shadow-brutal-md hover:-translate-y-1 transition-all",
                        isDragOver && "bg-primary/5"
                    )}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    "flex h-12 w-12 items-center justify-center rounded-xl border-2 border-border",
                                    colorClasses[folder.color]
                                )}
                            >
                                <FolderIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-display font-bold">{folder.name}</h3>
                                    {folder.isPinned && <Pin className="h-3 w-3 text-foreground/40" />}
                                </div>
                                <p className="text-sm text-foreground/50">
                                    {folder.count} bookmarks
                                    {childCount > 0 && (
                                        <span className="ml-2 text-xs">
                                            • {childCount} sub-folder{childCount !== 1 ? "s" : ""}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Menu */}
                        {folder.type !== "system" && (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setMenuOpen(!menuOpen);
                                    }}
                                    className="rounded-lg p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-opacity"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>

                                {menuOpen && (
                                    <div
                                        onClick={(e) => e.preventDefault()}
                                        className="absolute right-0 top-8 z-10 w-40 rounded-xl border-2 border-border bg-surface p-1 shadow-brutal-md"
                                    >
                                        <button
                                            onClick={handlePin}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent-mint/30"
                                        >
                                            {folder.isPinned ? (
                                                <>
                                                    <PinOff className="h-4 w-4" />
                                                    Unpin
                                                </>
                                            ) : (
                                                <>
                                                    <Pin className="h-4 w-4" />
                                                    Pin
                                                </>
                                            )}
                                        </button>
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
                        )}
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}
