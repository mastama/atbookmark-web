"use client";

import { motion } from "framer-motion";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyFolderViewProps {
    folderName?: string;
    onAddBookmark?: () => void;
}

export function EmptyFolderView({ folderName, onAddBookmark }: EmptyFolderViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
        >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface">
                <FolderOpen className="h-12 w-12 text-foreground/30" />
            </div>
            <h3 className="font-display text-xl font-bold">This folder is empty</h3>
            <p className="mt-2 max-w-xs text-foreground/60">
                {folderName ? `Add bookmarks to "${folderName}" to see them here.` : "Start adding bookmarks to see them here."}
            </p>
            {onAddBookmark && (
                <Button className="mt-6" onClick={onAddBookmark}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bookmark Here
                </Button>
            )}
        </motion.div>
    );
}
