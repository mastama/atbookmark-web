"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { cn } from "@/lib/utils";
import {
    Home,
    Inbox,
    Library,
    Folder,
    Tag,
    Settings,
    X,
    Plus,
    ChevronRight,
    GripVertical,
    LucideArchive,
    Puzzle,
    BarChart3,
} from "lucide-react";
import { useState, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useOrganization, Folder as FolderType } from "@/hooks/useOrganization";
import { useBookmarks } from "@/hooks/useBookmarks";
import { CreateFolderModal } from "@/components/modals/CreateFolderModal";
import { CreateTagModal } from "@/components/modals/CreateTagModal";
import { ProModal } from "@/components/modals/ProModal";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

// Simplified navigation - all features are free
const navGroups = [
    {
        label: "My Brain",
        items: [
            { label: "Home", href: "/dashboard", icon: Home },
            { label: "All Library", href: "/dashboard/library", icon: Library },
            { label: "Archives", href: "/dashboard/archives", icon: LucideArchive },
        ],
    },
    {
        label: "Tools",
        items: [
            { label: "Usage", href: "/dashboard/settings?tab=usage", icon: BarChart3 },
            { label: "Extension", href: "/dashboard/extension", icon: Puzzle },
        ],
    },
];

const colorClasses: Record<string, string> = {
    mint: "text-green-600",
    lavender: "text-purple-500",
    coral: "text-rose-500",
    sky: "text-sky-500",
    yellow: "text-amber-500",
    gray: "text-gray-500",
    red: "text-red-500",
    orange: "text-orange-500",
    amber: "text-amber-500",
    lime: "text-lime-500",
    green: "text-green-500",
    emerald: "text-emerald-500",
    teal: "text-teal-500",
    cyan: "text-cyan-500",
    blue: "text-blue-500",
    indigo: "text-indigo-500",
    violet: "text-violet-500",
    purple: "text-purple-500",
    fuchsia: "text-fuchsia-500",
    pink: "text-pink-500",
    rose: "text-rose-500",
    slate: "text-slate-500",
    neutral: "text-neutral-500",
};

const FREE_FOLDER_LIMIT = 3;
const FREE_TAG_LIMIT = 3;

// Recursive Folder Item Component
interface FolderItemProps {
    folder: FolderType;
    level: number;
    pathname: string;
    getBookmarkCount: (id: string) => number;
    getChildFolders: (id: string) => FolderType[];
    onDragStart: (e: DragEvent, folder: FolderType) => void;
    onDragOver: (e: DragEvent) => void;
    onDrop: (e: DragEvent, targetFolder: FolderType) => void;
}

function FolderItem({
    folder,
    level,
    pathname,
    getBookmarkCount,
    getChildFolders,
    onDragStart,
    onDragOver,
    onDrop,
}: FolderItemProps) {
    const [expanded, setExpanded] = useState(true);
    const [isDragOver, setIsDragOver] = useState(false);
    const children = getChildFolders(folder.id);
    const count = getBookmarkCount(folder.id);
    const hasChildren = children.length > 0;

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
        onDragOver(e);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        onDrop(e, folder);
    };

    return (
        <li>
            <div
                draggable
                onDragStart={(e) => onDragStart(e, folder)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "group flex items-center gap-1 rounded-lg py-1.5 text-sm transition-all cursor-grab",
                    "pr-3",
                    isDragOver && "bg-primary/20 ring-2 ring-primary",
                    pathname === `/dashboard/folder/${folder.id}`
                        ? "bg-primary/10 font-medium text-primary"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                )}
                style={{ paddingLeft: `${12 + level * 16}px` }}
            >
                {hasChildren ? (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-0.5 hover:bg-gray-200 rounded"
                    >
                        <ChevronRight
                            className={cn(
                                "h-3 w-3 transition-transform",
                                expanded && "rotate-90"
                            )}
                        />
                    </button>
                ) : (
                    <span className="w-4" />
                )}
                <GripVertical className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100" />
                <Link
                    href={`/dashboard/folder/${folder.id}`}
                    className="flex flex-1 items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Folder
                        className={cn(
                            "h-4 w-4",
                            colorClasses[folder.color] || "text-gray-500"
                        )}
                    />
                    <span className="flex-1 truncate">{folder.name}</span>
                    {count > 0 && (
                        <span className="text-[10px] text-gray-400">{count}</span>
                    )}
                </Link>
            </div>
            {hasChildren && expanded && (
                <ul className="space-y-0.5">
                    {children.map((child) => (
                        <FolderItem
                            key={child.id}
                            folder={child}
                            level={level + 1}
                            pathname={pathname}
                            getBookmarkCount={getBookmarkCount}
                            getChildFolders={getChildFolders}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter(); // Gunakan router untuk navigasi manual jika perlu
    const {
        folders,
        tags,
        isPro,
        getPinnedRootFolders,
        getChildFolders,
        getPinnedTags,
        setParentId,
    } = useOrganization();
    const { getBookmarkCount } = useBookmarks();

    // Modal states
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const [createTagOpen, setCreateTagOpen] = useState(false);
    const [proModalOpen, setProModalOpen] = useState(false);

    // Drag state
    const [draggedFolder, setDraggedFolder] = useState<FolderType | null>(null);

    // Fix: Find inbox by logic (system type + name Inbox) NOT hardcoded ID 'inbox'
    const inboxFolder = folders.find((f) => f.type === 'system' && f.name === 'Inbox');
    // If inboxFolder is found, use its ID for counting. Fallback to 'inbox' string if needed but likely wrong.
    const inboxCount = inboxFolder ? getBookmarkCount(inboxFolder.id) : 0;

    // Ensure Inbox is REMOVED from custom folders list if it accidentally got in there (it shouldn't if type is system)
    const customFolders = folders.filter((f) => f.type === "custom");

    const pinnedRootFolders = getPinnedRootFolders().filter((f) =>
        f.id !== "inbox" && f.type !== 'system' && f.name !== 'Inbox'
    );
    const visibleFolders = isPro
        ? pinnedRootFolders
        : pinnedRootFolders.slice(0, FREE_FOLDER_LIMIT);

    const pinnedTags = getPinnedTags();

    const handleAddFolder = () => {
        if (!isPro && customFolders.length >= FREE_FOLDER_LIMIT) {
            setProModalOpen(true);
        } else {
            setCreateFolderOpen(true);
        }
    };

    const handleAddTag = () => {
        if (!isPro && tags.length >= FREE_TAG_LIMIT) {
            setProModalOpen(true);
        } else {
            setCreateTagOpen(true);
        }
    };

    // Drag and Drop handlers
    const handleDragStart = (e: DragEvent, folder: FolderType) => {
        setDraggedFolder(folder);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: DragEvent, targetFolder: FolderType) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedFolder || draggedFolder.id === targetFolder.id) return;

        const isChild = (parentId: string | null, checkId: string): boolean => {
            if (!parentId) return false;
            if (parentId === checkId) return true;
            const parent = folders.find((f) => f.id === parentId);
            return parent ? isChild(parent.parentId, checkId) : false;
        };
        if (isChild(targetFolder.parentId, draggedFolder.id)) {
            toast.error("Cannot nest a folder into its own child");
            return;
        }
        setParentId(draggedFolder.id, targetFolder.id);
        toast.success(`Moved "${draggedFolder.name}" into "${targetFolder.name}"`);
        setDraggedFolder(null);
    };

    const handleDropOnRoot = (e: DragEvent) => {
        e.preventDefault();
        if (!draggedFolder) return;
        setParentId(draggedFolder.id, null);
        toast.success(`Moved "${draggedFolder.name}" to root`);
        setDraggedFolder(null);
    };

    // Simplified: Close sidebar on mobile
    const handleMenuClick = () => {
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r-2 border-border bg-surface transition-transform lg:static lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center justify-between border-b-2 border-border px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                            🔖
                        </div>
                        <span className="font-display text-lg font-bold">atBookmark</span>
                    </Link>
                    <button onClick={onClose} className="lg:hidden">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
                    {/* Inbox */}
                    {inboxFolder && (
                        <div className="mb-4">
                            <Link
                                href="/dashboard/inbox"
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-all",
                                    pathname === "/dashboard/inbox"
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                )}
                            >
                                <Inbox className="h-5 w-5" />
                                <span className="flex-1">Inbox</span>
                                {inboxCount > 0 && (
                                    <span className="text-[10px] text-gray-400">
                                        {inboxCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    )}

                    {/* Nav Groups */}
                    {navGroups.map((group) => (
                        <div key={group.label} className="mb-6">
                            <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                {group.label}
                            </h3>
                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href || pathname.startsWith(item.href.split('?')[0]);

                                    return (
                                        <li key={item.label}>
                                            <Link
                                                href={item.href}
                                                onClick={handleMenuClick}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                                                    isActive
                                                        ? "bg-primary/10 font-medium text-primary"
                                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="flex-1">{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}

                    <div
                        className="mb-4"
                        onDragOver={handleDragOver}
                        onDrop={handleDropOnRoot}
                    >
                        <div className="flex items-center justify-between px-3 py-2">
                            <Link
                                href="/dashboard/folders"
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-primary transition-colors"
                            >
                                <Folder className="h-4 w-4" />
                                Folders
                            </Link>
                            <button
                                onClick={handleAddFolder}
                                className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                title="Add Folder"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        {visibleFolders.length > 0 ? (
                            <ul className="space-y-0.5">
                                {visibleFolders.map((folder) => (
                                    <FolderItem
                                        key={folder.id}
                                        folder={folder}
                                        level={0}
                                        pathname={pathname}
                                        getBookmarkCount={getBookmarkCount}
                                        getChildFolders={getChildFolders}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="px-6 py-2 text-xs text-gray-400">
                                No pinned folders
                            </p>
                        )}

                        {!isPro && pinnedRootFolders.length > FREE_FOLDER_LIMIT && (
                            <button
                                onClick={() => setProModalOpen(true)}
                                className="mt-1 w-full px-6 py-1 text-left text-xs text-gray-400 hover:text-primary"
                            >
                                +{pinnedRootFolders.length - FREE_FOLDER_LIMIT} more (Pro)
                            </button>
                        )}
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between px-3 py-2">
                            <Link
                                href="/dashboard/tags"
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-primary transition-colors"
                            >
                                <Tag className="h-4 w-4" />
                                Tags
                            </Link>
                            {isPro && (
                                <button
                                    onClick={handleAddTag}
                                    className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    title="Add Tag"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {isPro ? (
                            pinnedTags.length > 0 ? (
                                <ul className="space-y-0.5">
                                    {pinnedTags.map((tag) => (
                                        <li key={tag.id}>
                                            <Link
                                                href={`/dashboard/tag/${tag.id}`}
                                                className={cn(
                                                    "flex items-center gap-2 rounded-lg pl-6 pr-3 py-1.5 text-sm transition-all",
                                                    pathname === `/dashboard/tag/${tag.id}`
                                                        ? "bg-primary/10 font-medium text-primary"
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "h-2 w-2 rounded-full",
                                                        `bg-${tag.color}-400`
                                                    )}
                                                    style={{
                                                        backgroundColor: `var(--${tag.color}-400, #9ca3af)`,
                                                    }}
                                                />
                                                {tag.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="px-6 py-2 text-xs text-gray-400">
                                    No pinned tags
                                </p>
                            )
                        ) : (
                            <Link
                                href="/dashboard/tags"
                                className="block px-6 py-2 text-xs text-gray-500 hover:text-primary"
                            >
                                View all tags →
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Footer */}
                <div className="border-t-2 border-border p-4">
                    {/* Support Developer Button */}
                    <button
                        onClick={() => setProModalOpen(true)}
                        className="mb-3 w-full rounded-lg bg-accent-mint/20 px-3 py-2 text-sm font-medium text-black-700 hover:bg-accent-mint/30 transition-colors flex items-center justify-center gap-2"
                    >
                        ☕ Trakteer Coffee
                    </button>

                    <ul className="space-y-1">
                        {/* UPDATE 3: Menu Trash dihapus sesuai permintaan */}
                        <li>
                            <Link
                                href="/dashboard/settings"
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <Settings className="h-5 w-5" />
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>

            <CreateFolderModal isOpen={createFolderOpen} onClose={() => setCreateFolderOpen(false)} />
            <CreateTagModal isOpen={createTagOpen} onClose={() => setCreateTagOpen(false)} />
            <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
        </>
    );
}