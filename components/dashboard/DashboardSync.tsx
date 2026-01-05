"use client";

import { useEffect } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useOrganization } from "@/hooks/useOrganization";

export function DashboardSync() {
    const fetchBookmarks = useBookmarks(state => state.fetchBookmarks);
    const fetchOrganization = useOrganization(state => state.fetchOrganization);

    useEffect(() => {
        const load = async () => {
            await Promise.all([
                fetchBookmarks(),
                fetchOrganization()
            ]);
        };
        load();
    }, [fetchBookmarks, fetchOrganization]);

    return null;
}
