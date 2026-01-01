"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Plus,
    Inbox,
    Home,
    Heart,
    Library,
    Settings,
    Folder,
    Hash,
    ExternalLink,
    ArrowRight,
    Search,
} from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";

// Color mapping for folder icons
const folderColors: Record<string, string> = {
    mint: "text-green-500",
    lavender: "text-purple-500",
    coral: "text-rose-500",
    sky: "text-sky-500",
    yellow: "text-amber-500",
    gray: "text-gray-500",
};

export function CommandMenu() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { folders, tags } = useOrganization();
    const { bookmarks } = useBookmarks();

    // Get recent bookmarks (top 5, non-trashed)
    const recentBookmarks = bookmarks
        .filter((b) => !b.isTrashed)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);

    // Custom folders (exclude system folders like inbox for the Folders group)
    const customFolders = folders.filter((f) => f.type === "custom");

    // Keyboard shortcut handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Listen for custom event from Header search bar
    useEffect(() => {
        const handleOpenEvent = () => setOpen(true);
        window.addEventListener("openCommandMenu", handleOpenEvent);
        return () => window.removeEventListener("openCommandMenu", handleOpenEvent);
    }, []);

    // Navigation helper
    const runCommand = useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    // Dispatch event to open modals
    const openAddBookmarkModal = () => {
        window.dispatchEvent(new CustomEvent("openAddBookmarkModal"));
    };

    const openCreateFolderModal = () => {
        window.dispatchEvent(new CustomEvent("openCreateFolderModal"));
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                {/* Quick Actions */}
                <CommandGroup heading="Actions">
                    <CommandItem
                        onSelect={() => runCommand(openAddBookmarkModal)}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4 text-primary" />
                        <span>Add New Bookmark</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(openCreateFolderModal)}
                        className="gap-2"
                    >
                        <Folder className="h-4 w-4 text-accent-mint" />
                        <span>Create New Folder</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/dashboard/folder/inbox"))}
                        className="gap-2"
                    >
                        <Inbox className="h-4 w-4 text-foreground/70" />
                        <span>Go to Inbox</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                {/* Navigation */}
                <CommandGroup heading="Navigation">
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/dashboard"))}
                        className="gap-2"
                    >
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/dashboard/favorites"))}
                        className="gap-2"
                    >
                        <Heart className="h-4 w-4 text-accent-coral" />
                        <span>Favorites</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/dashboard/library"))}
                        className="gap-2"
                    >
                        <Library className="h-4 w-4 text-accent-lavender" />
                        <span>All Library</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/dashboard/settings"))}
                        className="gap-2"
                    >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                    </CommandItem>
                </CommandGroup>

                {/* Folders */}
                {customFolders.length > 0 && (
                    <>
                        <CommandSeparator />
                        <CommandGroup heading="Folders">
                            {customFolders.map((folder) => (
                                <CommandItem
                                    key={folder.id}
                                    onSelect={() =>
                                        runCommand(() => router.push(`/dashboard/folder/${folder.id}`))
                                    }
                                    className="gap-2"
                                >
                                    <Folder
                                        className={cn(
                                            "h-4 w-4",
                                            folderColors[folder.color] || "text-foreground/70"
                                        )}
                                    />
                                    <span>{folder.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <>
                        <CommandSeparator />
                        <CommandGroup heading="Tags">
                            {tags.slice(0, 8).map((tag) => (
                                <CommandItem
                                    key={tag.id}
                                    onSelect={() =>
                                        runCommand(() => router.push(`/dashboard/tag/${tag.id}`))
                                    }
                                    className="gap-2"
                                >
                                    <Hash className="h-4 w-4 text-accent-sky" />
                                    <span>{tag.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </>
                )}

                {/* Recent Bookmarks */}
                {recentBookmarks.length > 0 && (
                    <>
                        <CommandSeparator />
                        <CommandGroup heading="Recent Bookmarks">
                            {recentBookmarks.map((bookmark) => (
                                <CommandItem
                                    key={bookmark.id}
                                    onSelect={() =>
                                        runCommand(() => window.open(bookmark.url, "_blank"))
                                    }
                                    className="gap-2"
                                >
                                    <ExternalLink className="h-4 w-4 text-foreground/50" />
                                    <span className="truncate">{bookmark.title}</span>
                                    <span className="ml-auto text-xs text-foreground/40">
                                        {bookmark.domain}
                                    </span>
                                </CommandItem>
                            ))}

                            {/* View All in Library */}
                            <CommandItem
                                onSelect={() => runCommand(() => router.push("/dashboard/library"))}
                                className="gap-2 mt-1 border-t border-border/30 pt-2"
                            >
                                <ArrowRight className="h-4 w-4 text-primary" />
                                <span className="font-medium text-primary">
                                    View all in Library...
                                </span>
                            </CommandItem>
                        </CommandGroup>
                    </>
                )}
            </CommandList>
        </CommandDialog>
    );
}
