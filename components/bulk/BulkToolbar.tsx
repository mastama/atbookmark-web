"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderInput, Trash2, ChevronDown, Check } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { useBookmarks } from "@/hooks/useBookmarks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BulkToolbarProps {
    selectedIds: string[];
    onClear: () => void;
    type: "bookmarks" | "tags";
}

export function BulkToolbar({ selectedIds, onClear, type }: BulkToolbarProps) {
    const { folders, removeTags } = useOrganization();
    const { trashBookmarks, moveBookmarks } = useBookmarks();
    const [moveOpen, setMoveOpen] = useState(false);
    const moveRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (moveRef.current && !moveRef.current.contains(e.target as Node)) {
                setMoveOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMove = (folderId: string) => {
        moveBookmarks(selectedIds, folderId);
        const folder = folders.find((f) => f.id === folderId);
        toast.success(`Moved ${selectedIds.length} item(s) to ${folder?.name || "folder"}`);
        onClear();
        setMoveOpen(false);
    };

    const handleDelete = () => {
        if (type === "bookmarks") {
            if (confirm(`Move ${selectedIds.length} item(s) to trash?`)) {
                trashBookmarks(selectedIds);
                toast.success(`Moved ${selectedIds.length} item(s) to trash 🗑️`);
                onClear();
            }
        } else {
            if (confirm(`Delete ${selectedIds.length} tag(s)? This cannot be undone.`)) {
                removeTags(selectedIds);
                toast.success(`Deleted ${selectedIds.length} tag(s) 🗑️`);
                onClear();
            }
        }
    };

    const customFolders = folders.filter((f) => f.type !== "system" || f.id === "inbox");

    if (selectedIds.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
            >
                <div className="flex items-center gap-2 rounded-full border-2 border-border bg-gray-900 px-4 py-2.5 shadow-brutal-lg">
                    {/* Selection Count */}
                    <span className="mr-2 text-sm font-medium text-white">
                        {selectedIds.length} selected
                    </span>

                    <div className="h-4 w-px bg-gray-600" />

                    {/* Move Button (Bookmarks only) */}
                    {type === "bookmarks" && (
                        <div className="relative" ref={moveRef}>
                            <button
                                onClick={() => setMoveOpen(!moveOpen)}
                                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                            >
                                <FolderInput className="h-4 w-4" />
                                Move
                                <ChevronDown
                                    className={cn(
                                        "h-3 w-3 transition-transform",
                                        moveOpen && "rotate-180"
                                    )}
                                />
                            </button>

                            {/* Folder Dropdown */}
                            <AnimatePresence>
                                {moveOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-full left-0 mb-2 w-48 rounded-xl border-2 border-border bg-surface p-1 shadow-brutal-md"
                                    >
                                        <div className="max-h-60 overflow-y-auto">
                                            {customFolders.map((folder) => (
                                                <button
                                                    key={folder.id}
                                                    onClick={() => handleMove(folder.id)}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                                                >
                                                    <span
                                                        className={cn(
                                                            "h-2 w-2 rounded-full",
                                                            folder.color === "mint" && "bg-green-400",
                                                            folder.color === "lavender" && "bg-purple-400",
                                                            folder.color === "coral" && "bg-rose-400",
                                                            folder.color === "sky" && "bg-sky-400",
                                                            folder.color === "yellow" && "bg-amber-400",
                                                            folder.color === "gray" && "bg-gray-400"
                                                        )}
                                                    />
                                                    {folder.name}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </button>

                    <div className="h-4 w-px bg-gray-600" />

                    {/* Cancel Button */}
                    <button
                        onClick={onClear}
                        className="rounded-full p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        title="Clear selection"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
