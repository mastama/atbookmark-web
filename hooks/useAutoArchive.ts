"use client";

import { useEffect, useRef } from "react";
import { useBookmarks } from "./useBookmarks";
import { toast } from "sonner";

/**
 * Hook to run auto-archive on dashboard load.
 * 
 * Auto-archive rules:
 * 1. Bookmarks not accessed for 30 days → automatically moved to Archives
 * 2. Archived bookmarks after 30 days → permanently deleted
 * 
 * This hook runs once when the dashboard mounts.
 */
export function useAutoArchive() {
    const { runAutoArchive } = useBookmarks();
    const hasRun = useRef(false);

    useEffect(() => {
        // Only run once per session
        if (hasRun.current) return;
        hasRun.current = true;

        // Run auto-archive with a small delay to not block initial render
        const timer = setTimeout(() => {
            const result = runAutoArchive();

            // Show notifications if anything was processed
            if (result.archivedCount > 0) {
                toast.info(
                    `📦 Auto-archived ${result.archivedCount} bookmark${result.archivedCount > 1 ? 's' : ''} (inactive for 30+ days)`,
                    { duration: 5000 }
                );
            }

            if (result.deletedCount > 0) {
                toast.info(
                    `🗑️ Cleaned up ${result.deletedCount} old archived item${result.deletedCount > 1 ? 's' : ''}`,
                    { duration: 5000 }
                );
            }
        }, 2000); // Wait 2 seconds after load

        return () => clearTimeout(timer);
    }, [runAutoArchive]);
}

/**
 * Higher-order component to wrap dashboard layout with auto-archive functionality.
 * Simply import and call this hook in the dashboard layout.
 */
export default useAutoArchive;
