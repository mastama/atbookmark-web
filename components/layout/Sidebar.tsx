"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { cn } from "@/lib/utils";
import {
    Home,
    Inbox,
    Library,
    Sparkles,
    Brain,
    TrendingDown,
    Folder,
    Tag,
    Settings,
    X,
    Plus,
    ChevronRight,
    GripVertical,
    LucideArchive,
    Lock,
    Puzzle,
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

// UPDATE 1: Menambahkan flag isPro dan isDev pada konfigurasi menu
const navGroups = [
    {
        label: "My Brain",
        items: [
            { label: "Home", href: "/dashboard", icon: Home, isPro: false, isDev: false },
            { label: "All Library", href: "/dashboard/library", icon: Library, isPro: false, isDev: false },
        ],
    },
    {
        label: "Smart Views",
        items: [
            { label: "Archives", href: "/dashboard/archives", icon: LucideArchive, isPro: false, isDev: false },
            { label: "AI Curated", href: "/dashboard/ai-curated", icon: Sparkles, isPro: true, isDev: true },
            { label: "Knowledge Graph", href: "/dashboard/knowledge", icon: Brain, isPro: true, isDev: true },
            { label: "RAM Saver", href: "/dashboard/ram-saver", icon: TrendingDown, isPro: true, isDev: true },
        ],
    },
    {
        label: "Tools",
        items: [
            { label: "Extension", href: "/dashboard/extension", icon: Puzzle, isPro: false, isDev: false },
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
                        : "hover:bg-gray-100"
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

    const inboxFolder = folders.find((f) => f.id === "inbox");
    const inboxCount = getBookmarkCount("inbox");
    const customFolders = folders.filter((f) => f.type === "custom");

    const pinnedRootFolders = getPinnedRootFolders().filter((f) => f.id !== "inbox");
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

    // UPDATE 2: Helper function untuk menangani klik menu
    const handleMenuClick = (e: React.MouseEvent, item: typeof navGroups[0]['items'][0]) => {
        // 1. Cek apakah fitur Pro dan user masih Free
        if (item.isPro && !isPro) {
            e.preventDefault(); // Jangan pindah halaman
            setProModalOpen(true);
            return;
        }

        // 2. Cek apakah fitur masih dalam pengembangan (isDev)
        if (item.isDev) {
            e.preventDefault(); // Jangan pindah halaman (cegah 404)
            toast.info("This feature is currently under development! 🚀");
            return;
        }

        // Default: Biarkan Link bekerja normal
        // Close sidebar on mobile if needed
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
                                href="/dashboard/folder/inbox"
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-all",
                                    pathname === "/dashboard/folder/inbox"
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

                    {/* Nav Groups (Updated with Logic) */}
                    {navGroups.map((group) => (
                        <div key={group.label} className="mb-6">
                            <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                {group.label}
                            </h3>
                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    const isLocked = item.isPro && !isPro;

                                    return (
                                        <li key={item.label}>
                                            <Link
                                                href={item.href}
                                                onClick={(e) => handleMenuClick(e, item)}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all group",
                                                    isActive
                                                        ? "bg-primary/10 font-medium text-primary"
                                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                                                    isLocked && "opacity-75 hover:opacity-100"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="flex-1">{item.label}</span>

                                                {/* Show Lock icon if Pro and User is Free */}
                                                {isLocked && (
                                                    <Lock className="h-3 w-3 text-gray-400 group-hover:text-amber-500 transition-colors" />
                                                )}
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
                                className="rounded-md p-1 hover:bg-gray-100 transition-colors"
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
                                    className="rounded-md p-1 hover:bg-gray-100 transition-colors"
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
                                                        : "hover:bg-gray-100"
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
                    {/* Pro Badge / Upgrade */}
                    {isPro ? (
                        <div className="mb-3 flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-2">
                            <span className="text-sm">✨</span>
                            <span className="text-sm font-bold text-amber-700">Pro Active</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => setProModalOpen(true)}
                            className="mb-3 w-full rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                        >
                            ✨ Upgrade to Pro
                        </button>
                    )}

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

                    {/* Dev Toggle */}
                    <button
                        onClick={() => {
                            useOrganization.getState().setIsPro(!isPro);
                            toast.success(isPro ? "Switched to Free Plan" : "Switched to Pro Plan ✨");
                        }}
                        className="mt-4 w-full text-center text-xs text-gray-300 hover:text-gray-500 transition-colors"
                    >
                        [Dev: Toggle Pro]
                    </button>
                </div>
            </aside>

            <CreateFolderModal isOpen={createFolderOpen} onClose={() => setCreateFolderOpen(false)} />
            <CreateTagModal isOpen={createTagOpen} onClose={() => setCreateTagOpen(false)} />
            <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
        </>
    );
}