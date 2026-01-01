"use client";

import {
    Trash2,
    CheckCircle,
    XCircle,
    ChevronDown,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useBookmarks } from "@/hooks/useBookmarks";
import { toast } from "sonner";

interface LibraryCleanupMenuProps {
    selectedIds: string[]; // Diganti dari count ke array ID
    filteredIds: string[]; // ID hasil filter saat ini
    onClearSelection: () => void;
}

export function LibraryCleanupMenu({
    selectedIds,
    filteredIds,
    onClearSelection,
}: LibraryCleanupMenuProps) {
    // Pastikan updateReadStatus sudah ada di store Anda (sesuai langkah sebelumnya)
    const {
        bookmarks,
        trashBookmarks,
        updateReadStatus // Action baru
    } = useBookmarks();

    // --- 1. CRITICAL LOGIC: SCOPE DETERMINATION ---
    const isSelectionActive = selectedIds.length > 0;

    // Jika ada yang diseleksi, gunakan selectedIds.
    // Jika TIDAK, gunakan semua hasil filter (filteredIds).
    const targetIds = isSelectionActive ? selectedIds : filteredIds;
    const actionCount = targetIds.length;
    const scopeLabel = isSelectionActive ? "selected" : "filtered";

    // --- 2. MARK AS READ / UNREAD HANDLERS ---

    const handleMarkAllRead = () => {
        if (actionCount === 0) {
            toast.error("No items to update");
            return;
        }

        // Panggil store action
        updateReadStatus(targetIds, true); // true = isRead

        toast.success(`Marked ${actionCount} items as read`);

        if (isSelectionActive) {
            onClearSelection();
        }
    };

    const handleMarkAllUnread = () => {
        if (actionCount === 0) {
            toast.error("No items to update");
            return;
        }

        // Panggil store action
        updateReadStatus(targetIds, false); // false = unread

        toast.success(`Marked ${actionCount} items as unread`);

        if (isSelectionActive) {
            onClearSelection();
        }
    };

    // --- 3. DELETE HANDLERS ---

    const handleDeleteAllFiltered = () => {
        if (actionCount === 0) {
            toast.error("No items to delete");
            return;
        }

        if (
            window.confirm(
                `⚠️ Delete ${actionCount} ${scopeLabel} item(s)?\n\nThis action cannot be undone.`
            )
        ) {
            trashBookmarks(targetIds);
            toast.success(`Deleted ${actionCount} items`);
            if (isSelectionActive) {
                onClearSelection();
            }
        }
    };

    // Logic khusus untuk "Delete Read" (Hanya menghapus yang statusnya Read di dalam scope target)
    const handleDeleteReadInScope = () => {
        // Filter targetIds untuk mencari mana yang isRead === true
        const readIdsInScope = targetIds.filter(id => {
            const item = bookmarks.find(b => b.id === id);
            // @ts-ignore (jika properti isRead belum terdeteksi TS)
            return item && item.isRead === true;
        });

        if (readIdsInScope.length === 0) {
            toast.error(`No read items found in current ${scopeLabel} list`);
            return;
        }

        if (confirm(`Delete ${readIdsInScope.length} read item(s)?`)) {
            trashBookmarks(readIdsInScope);
            toast.success(`Deleted ${readIdsInScope.length} read items`);
            if (isSelectionActive) onClearSelection();
        }
    };

    // Logic khusus untuk "Delete Unread" (Hanya menghapus yang statusnya Unread di dalam scope target)
    const handleDeleteUnreadInScope = () => {
        // Filter targetIds untuk mencari mana yang isRead === false/undefined
        const unreadIdsInScope = targetIds.filter(id => {
            const item = bookmarks.find(b => b.id === id);
            // @ts-ignore
            return item && !item.isRead;
        });

        if (unreadIdsInScope.length === 0) {
            toast.error(`No unread items found in current ${scopeLabel} list`);
            return;
        }

        if (confirm(`⚠️ DANGER: Delete ${unreadIdsInScope.length} UNREAD item(s)?`)) {
            trashBookmarks(unreadIdsInScope);
            toast.success(`Deleted ${unreadIdsInScope.length} unread items`);
            if (isSelectionActive) onClearSelection();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9 border-dashed">
                    <Trash2 className="h-4 w-4 text-gray-500" />
                    Actions
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                {/* Scope Indicator */}
                <DropdownMenuLabel className="flex items-center gap-2 text-xs font-normal text-muted-foreground bg-gray-50 py-2">
                    <AlertTriangle className="h-3 w-3" />
                    Acting on <span className="font-bold text-foreground">{actionCount}</span> {scopeLabel} items
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Mark Actions */}
                <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleMarkAllRead} className="cursor-pointer">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkAllUnread} className="cursor-pointer">
                    <XCircle className="mr-2 h-4 w-4 text-gray-400" />
                    Mark as Unread
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Delete Actions */}
                <DropdownMenuLabel className="text-xs text-red-500 font-bold">
                    Danger Zone
                </DropdownMenuLabel>

                <DropdownMenuItem onClick={handleDeleteReadInScope} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Read Items
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleDeleteUnreadInScope} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Unread Items
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleDeleteAllFiltered}
                    className="cursor-pointer bg-red-50 text-red-700 focus:bg-red-100 focus:text-red-800 font-bold"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ALL {scopeLabel.toUpperCase()}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}