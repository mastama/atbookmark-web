"use client";

import { useAutoArchive } from "@/hooks/useAutoArchive";

/**
 * Client component that runs the auto-archive logic when mounted.
 * Place this in the dashboard layout to enable auto-archive functionality.
 */
export function AutoArchiveProvider({ children }: { children: React.ReactNode }) {
    // Run auto-archive on mount
    useAutoArchive();

    return <>{children}</>;
}
