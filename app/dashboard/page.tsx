"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import {
    HomeHeader,
    OnboardingWidget,
    InboxWidget,
    RecentWidget,
    StatsWidget,
} from "@/components/dashboard/home";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

export default function DashboardPage() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    // Load view preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("dashboardViewMode") as ViewMode | null;
        if (saved === "grid" || saved === "list") {
            setViewMode(saved);
        }
    }, []);

    // Save view preference to localStorage
    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem("dashboardViewMode", mode);
    };

    const handleSearchClick = () => {
        // Trigger Cmd+K or open search modal
        // For now, just dispatch the keyboard event
        const event = new KeyboardEvent("keydown", {
            key: "k",
            metaKey: true,
            bubbles: true,
        });
        document.dispatchEvent(event);
    };

    return (
        <div className="mx-auto max-w-7xl space-y-8 pb-12">
            {/* Header with Search & Quick Capture */}
            <HomeHeader onSearchClick={handleSearchClick} />

            {/* Onboarding Widget (conditional) */}
            <OnboardingWidget />

            {/* Stats Widget */}
            <StatsWidget />

            {/* Inbox Widget */}
            <InboxWidget />

            {/* Section Divider with View Toggle */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center justify-between"
            >
                <div className="h-px flex-1 bg-border" />
                <div className="mx-4 flex items-center gap-2">
                    {/* <span className="text-sm font-medium text-foreground/50">
                        View
                    </span> */}
                    <div className="flex rounded-xl border-2 border-border bg-surface p-1">
                        <button
                            onClick={() => handleViewModeChange("grid")}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                                viewMode === "grid"
                                    ? "bg-primary text-white shadow-brutal-sm"
                                    : "text-foreground/50 hover:text-foreground"
                            )}
                            title="Grid View"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleViewModeChange("list")}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                                viewMode === "list"
                                    ? "bg-primary text-white shadow-brutal-sm"
                                    : "text-foreground/50 hover:text-foreground"
                            )}
                            title="List View"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="h-px flex-1 bg-border" />
            </motion.div>

            {/* Recent Bookmarks Widget */}
            <RecentWidget viewMode={viewMode} />
        </div>
    );
}
