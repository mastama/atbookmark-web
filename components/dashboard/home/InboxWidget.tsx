"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Inbox,
    Sparkles,
    PartyPopper,
    ExternalLink,
    Trash2,
    FolderInput,
    MoreHorizontal,
} from "lucide-react";
import { useBookmarks, Bookmark } from "@/hooks/useBookmarks";
import { useOrganization } from "@/hooks/useOrganization";
import { ProModal } from "@/components/modals/ProModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const MAX_ITEMS = 5;

export function InboxWidget() {
    const { bookmarks, removeBookmark, moveBookmarks } = useBookmarks();
    const { isPro, folders } = useOrganization();
    const [proModalOpen, setProModalOpen] = useState(false);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Get inbox items
    const inboxItems = bookmarks
        .filter((b) => b.folderId === "inbox" && !b.isTrashed)
        .slice(0, MAX_ITEMS);

    const isInboxZero = inboxItems.length === 0;
    const totalInbox = bookmarks.filter(
        (b) => b.folderId === "inbox" && !b.isTrashed
    ).length;

    const handleAIOrganize = () => {
        if (!isPro) {
            setProModalOpen(true);
        } else {
            toast.info("AI Organize coming soon! ✨");
        }
    };

    const handleDelete = (id: string) => {
        removeBookmark(id);
        toast.success("Removed from inbox");
    };

    const handleMoveToFolder = (id: string, folderId: string) => {
        moveBookmarks([id], folderId);
        const folder = folders.find((f) => f.id === folderId);
        toast.success(`Moved to ${folder?.name || "folder"}`);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border-2 border-border bg-surface p-6 shadow-brutal-sm"
            >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-accent-sky/30 shadow-brutal-sm">
                            <Inbox className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-display text-lg font-bold">
                                Inbox
                            </h3>
                            <p className="text-sm text-foreground/60">
                                {totalInbox} items to process
                            </p>
                        </div>
                    </div>

                    {/* AI Organize Button */}
                    <button
                        onClick={handleAIOrganize}
                        className={cn(
                            "flex items-center gap-2 rounded-xl border-2 border-border px-3 py-2 text-sm font-medium transition-all hover:shadow-brutal-sm",
                            isPro
                                ? "bg-accent-lavender/30 hover:bg-accent-lavender/50"
                                : "bg-secondary hover:bg-secondary/80"
                        )}
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>AI Organize</span>
                        {!isPro && (
                            <span className="text-xs text-foreground/50">✨</span>
                        )}
                    </button>
                </div>

                {/* Content */}
                {isInboxZero ? (
                    <InboxZeroState />
                ) : (
                    <div className="space-y-2">
                        {inboxItems.map((item, index) => (
                            <InboxItem
                                key={item.id}
                                item={item}
                                index={index}
                                isHovered={hoveredId === item.id}
                                onHover={() => setHoveredId(item.id)}
                                onLeave={() => setHoveredId(null)}
                                onDelete={() => handleDelete(item.id)}
                                onMove={(folderId) =>
                                    handleMoveToFolder(item.id, folderId)
                                }
                                folders={folders.filter(
                                    (f) => f.id !== "inbox"
                                )}
                            />
                        ))}

                        {/* View More */}
                        {totalInbox > MAX_ITEMS && (
                            <button className="mt-2 w-full rounded-xl border-2 border-dashed border-border py-2 text-sm font-medium text-foreground/50 hover:border-primary hover:text-primary transition-colors">
                                View {totalInbox - MAX_ITEMS} more →
                            </button>
                        )}
                    </div>
                )}
            </motion.div>

            <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
        </>
    );
}

function InboxZeroState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-8 text-center"
        >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-accent-mint bg-accent-mint/10">
                <PartyPopper className="h-10 w-10 text-accent-mint" />
            </div>
            <h4 className="font-display text-lg font-bold">Inbox Zero! 🎉</h4>
            <p className="mt-1 text-sm text-foreground/60">
                You're all caught up. Great job!
            </p>
        </motion.div>
    );
}

interface InboxItemProps {
    item: Bookmark;
    index: number;
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
    onDelete: () => void;
    onMove: (folderId: string) => void;
    folders: { id: string; name: string; color: string }[];
}

function InboxItem({
    item,
    index,
    isHovered,
    onHover,
    onLeave,
    onDelete,
    onMove,
    folders,
}: InboxItemProps) {
    const [showMoveMenu, setShowMoveMenu] = useState(false);

    const timeAgo = formatDistanceToNow(item.createdAt, { addSuffix: true })
        .replace("about ", "")
        .replace("less than a minute", "Just now");

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.domain}&sz=32`;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onMouseEnter={onHover}
            onMouseLeave={() => {
                onLeave();
                setShowMoveMenu(false);
            }}
            className="group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-secondary/50"
        >
            {/* Favicon */}
            <img
                src={faviconUrl}
                alt=""
                className="h-6 w-6 rounded-md"
                onError={(e) => (e.currentTarget.style.display = "none")}
            />

            {/* Content */}
            <div className="min-w-0 flex-1">
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm font-medium hover:text-primary transition-colors"
                >
                    {item.title}
                </a>
                <p className="text-xs text-foreground/50">
                    {item.domain} • {timeAgo}
                </p>
            </div>

            {/* Hover Actions */}
            <div
                className={cn(
                    "flex items-center gap-1 transition-opacity",
                    isHovered ? "opacity-100" : "opacity-0"
                )}
            >
                <button
                    onClick={() => window.open(item.url, "_blank")}
                    className="rounded-lg p-1.5 text-foreground/50 hover:bg-accent-sky/30 hover:text-primary"
                    title="Open"
                >
                    <ExternalLink className="h-4 w-4" />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowMoveMenu(!showMoveMenu)}
                        className="rounded-lg p-1.5 text-foreground/50 hover:bg-accent-lavender/30 hover:text-primary"
                        title="Move"
                    >
                        <FolderInput className="h-4 w-4" />
                    </button>

                    {/* Move Menu */}
                    {showMoveMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border-2 border-border bg-surface p-1 shadow-brutal-md"
                        >
                            {folders.map((folder) => (
                                <button
                                    key={folder.id}
                                    onClick={() => {
                                        onMove(folder.id);
                                        setShowMoveMenu(false);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary"
                                >
                                    <span
                                        className={cn(
                                            "h-2 w-2 rounded-full",
                                            `bg-accent-${folder.color}`
                                        )}
                                    />
                                    {folder.name}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>

                <button
                    onClick={onDelete}
                    className="rounded-lg p-1.5 text-foreground/50 hover:bg-accent-coral/30 hover:text-accent-coral"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
}
