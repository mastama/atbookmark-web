"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Chrome, FolderPlus, Link2, Command, Trophy, X } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useOrganization } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";

interface ChecklistItem {
    id: string;
    label: string;
    icon: React.ElementType;
    completed: boolean;
}

export function OnboardingWidget() {
    const { bookmarks } = useBookmarks();
    const { folders } = useOrganization();
    const [dismissed, setDismissed] = useState(false);

    // Calculate actual completion state
    const customFolders = folders.filter((f) => f.type === "custom");
    const hasEnoughBookmarks = bookmarks.length >= 3;
    const hasCustomFolder = customFolders.length > 0;

    // Mock states for extension and cmd+k (would be tracked in real app)
    const [extensionInstalled] = useState(false);
    const [cmdKUsed] = useState(false);

    const checklist: ChecklistItem[] = [
        {
            id: "extension",
            label: "Install Browser Extension",
            icon: Chrome,
            completed: extensionInstalled,
        },
        {
            id: "folder",
            label: "Create your first Folder",
            icon: FolderPlus,
            completed: hasCustomFolder,
        },
        {
            id: "bookmarks",
            label: "Save 3 links",
            icon: Link2,
            completed: hasEnoughBookmarks,
        },
        {
            id: "cmdk",
            label: "Try Cmd+K",
            icon: Command,
            completed: cmdKUsed,
        },
    ];

    const completedCount = checklist.filter((item) => item.completed).length;
    const allCompleted = completedCount === checklist.length;
    const progress = (completedCount / checklist.length) * 100;

    // Hide widget if dismissed or all completed or has more than 5 bookmarks
    if (dismissed || bookmarks.length >= 5) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border-2 border-border bg-gradient-to-br from-accent-lavender/20 via-surface to-accent-mint/20 p-6 shadow-brutal-sm"
        >
            {/* Dismiss Button */}
            <button
                onClick={() => setDismissed(true)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-foreground/40 hover:bg-secondary hover:text-foreground transition-colors"
            >
                <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-secondary shadow-brutal-sm">
                    <Trophy className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-display text-lg font-bold">
                        Getting Started
                    </h3>
                    <p className="text-sm text-foreground/60">
                        {completedCount}/{checklist.length} completed
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-mint to-accent-lavender"
                />
            </div>

            {/* Checklist */}
            <div className="space-y-3">
                {checklist.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + index * 0.05 }}
                        className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                            item.completed
                                ? "bg-accent-mint/20"
                                : "hover:bg-secondary/50"
                        )}
                    >
                        <div
                            className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-colors",
                                item.completed
                                    ? "border-accent-mint bg-accent-mint"
                                    : "border-border bg-surface"
                            )}
                        >
                            {item.completed ? (
                                <Check className="h-3.5 w-3.5 text-foreground" />
                            ) : (
                                <item.icon className="h-3 w-3 text-foreground/40" />
                            )}
                        </div>
                        <span
                            className={cn(
                                "text-sm font-medium transition-colors",
                                item.completed
                                    ? "text-foreground line-through"
                                    : "text-foreground/70"
                            )}
                        >
                            {item.label}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* All Completed State */}
            {allCompleted && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-accent-mint/30 px-4 py-3"
                >
                    <span className="text-xl">🎉</span>
                    <span className="text-sm font-bold">
                        You're ready! Badge unlocked.
                    </span>
                </motion.div>
            )}
        </motion.div>
    );
}
