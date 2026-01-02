"use client";

import { useEffect, useState, useRef } from "react";
import { getSidebarData } from "@/actions/sidebar";
import { useOrganization, type Folder, type Tag } from "@/hooks/useOrganization";

/**
 * Hook to sync sidebar data from Supabase to Zustand stores
 * This maintains backward compatibility with existing Zustand-based components
 */
export function useSyncSidebarData() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasSynced = useRef(false);

    useEffect(() => {
        // Only sync once per mount
        if (hasSynced.current) return;

        async function syncData() {
            try {
                setIsLoading(true);
                const data = await getSidebarData();

                if (!data.userId) {
                    // User not authenticated, keep local data
                    setIsLoading(false);
                    return;
                }

                hasSynced.current = true;

                // Transform folders from server
                const folders: Folder[] = data.folders.map((f) => ({
                    id: f.id,
                    name: f.name,
                    type: f.type,
                    color: f.color,
                    count: 0,
                    isPinned: false, // Default to false since column doesn't exist
                    parentId: f.parent_id,
                }));

                // Transform tags from server
                const tags: Tag[] = data.tags.map((t) => ({
                    id: t.id,
                    name: t.name,
                    color: t.color,
                    isPinned: false, // Default to false since column doesn't exist
                }));

                // ALWAYS replace local data with server data (even if empty)
                // This ensures new users start with empty data, not dummy data
                useOrganization.setState({
                    folders: folders,
                    tags: tags,
                    isPro: data.isPro,
                });

                setError(null);
            } catch (err) {
                console.error("Failed to sync sidebar data:", err);
                setError("Failed to load data from server");
            } finally {
                setIsLoading(false);
            }
        }

        syncData();
    }, []);

    return { isLoading, error };
}
