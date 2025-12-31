"use client";

import { useState, DragEvent } from "react";
import { motion } from "framer-motion";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolderCard } from "@/components/dashboard/FolderCard";
import { useOrganization, Folder } from "@/hooks/useOrganization";
import { CreateFolderModal } from "@/components/modals/CreateFolderModal";
import { ProModal } from "@/components/modals/ProModal";
import { toast } from "sonner";

const FREE_LIMIT = 3;

export default function FoldersPage() {
    const { folders, isPro, setParentId } = useOrganization();
    const [createOpen, setCreateOpen] = useState(false);
    const [proOpen, setProOpen] = useState(false);
    const [draggedFolder, setDraggedFolder] = useState<Folder | null>(null);

    // Only show root folders (no parentId)
    const rootFolders = folders.filter((f) => f.parentId === null);
    const customFolders = folders.filter((f) => f.type === "custom");

    const handleNewFolder = () => {
        if (!isPro && customFolders.length >= FREE_LIMIT) {
            setProOpen(true);
        } else {
            setCreateOpen(true);
        }
    };

    // Drag and Drop handlers for nesting folders
    const handleDragStart = (e: DragEvent, folder: Folder) => {
        setDraggedFolder(folder);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: DragEvent, targetFolder: Folder) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedFolder || draggedFolder.id === targetFolder.id) return;

        // Prevent dropping system folders or onto system folders (except inbox)
        if (draggedFolder.type === "system") {
            toast.error("Cannot move system folders");
            setDraggedFolder(null);
            return;
        }

        // Prevent circular dependency
        const isChild = (parentId: string | null, checkId: string): boolean => {
            if (!parentId) return false;
            if (parentId === checkId) return true;
            const parent = folders.find((f) => f.id === parentId);
            return parent ? isChild(parent.parentId, checkId) : false;
        };

        if (isChild(targetFolder.parentId, draggedFolder.id)) {
            toast.error("Cannot nest a folder into its own child");
            setDraggedFolder(null);
            return;
        }

        setParentId(draggedFolder.id, targetFolder.id);
        toast.success(`Moved "${draggedFolder.name}" into "${targetFolder.name}"`);
        setDraggedFolder(null);
    };

    return (
        <div className="mx-auto max-w-5xl pb-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-start justify-between"
            >
                <div>
                    <h1 className="font-display text-3xl font-bold">My Collections</h1>
                    <p className="mt-1 text-foreground/60">Your mental shelves.</p>
                </div>
                <Button onClick={handleNewFolder}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Folder
                    {!isPro && (
                        <span className="ml-2 text-xs opacity-70">
                            ({customFolders.length}/{FREE_LIMIT})
                        </span>
                    )}
                </Button>
            </motion.div>

            {/* Content - Only Root Folders */}
            {rootFolders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface">
                        <FolderOpen className="h-12 w-12 text-foreground/30" />
                    </div>
                    <h3 className="font-display text-xl font-bold">No folders yet</h3>
                    <p className="mt-2 max-w-xs text-foreground/60">
                        Start organizing by creating your first folder.
                    </p>
                    <Button className="mt-6" onClick={handleNewFolder}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Folder
                    </Button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rootFolders.map((folder, index) => (
                        <FolderCard
                            key={folder.id}
                            folder={folder}
                            index={index}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <CreateFolderModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
            <ProModal isOpen={proOpen} onClose={() => setProOpen(false)} />
        </div>
    );
}
