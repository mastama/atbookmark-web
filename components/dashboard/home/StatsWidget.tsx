"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    Library,
    FolderOpen,
    Tag,
    Heart,
    TrendingUp,
} from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useOrganization } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";

interface StatItem {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}

export function StatsWidget() {
    const { bookmarks } = useBookmarks();
    const { folders, tags } = useOrganization();

    const activeBookmarks = bookmarks.filter((b) => !b.isTrashed);
    const favoriteCount = activeBookmarks.filter((b) => b.isFavorite).length;
    const customFolders = folders.filter((f) => f.type === "custom");

    const stats: StatItem[] = [
        {
            label: "Total Bookmarks",
            value: activeBookmarks.length,
            icon: Library,
            color: "bg-accent-mint",
        },
        {
            label: "Folders",
            value: customFolders.length,
            icon: FolderOpen,
            color: "bg-accent-sky",
        },
        {
            label: "Tags",
            value: tags.length,
            icon: Tag,
            color: "bg-accent-lavender",
        },
        {
            label: "Favorites",
            value: favoriteCount,
            icon: Heart,
            color: "bg-accent-coral",
        },
    ];

    // Calculate week-over-week trend (mock data for demo)
    const weeklyData = [35, 50, 25, 70, 45, 80, 60];
    const thisWeekTotal = weeklyData.reduce((a, b) => a + b, 0);
    const lastWeekTotal = thisWeekTotal * 0.8; // Mock: assume last week was 80% of this week
    const percentChange = Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
        >
            {/* Stats Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="rounded-xl border-2 border-border bg-surface p-4 transition-all hover:shadow-brutal-sm hover:-translate-y-0.5"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border shadow-brutal-sm",
                                    stat.color
                                )}
                            >
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold font-display">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-foreground/60">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Weekly Insights Section - Now FREE! */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-surface p-6">
                {/* Header */}
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-secondary shadow-brutal-sm">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold">
                            Weekly Insights
                        </h3>
                        <p className="text-sm text-foreground/60">
                            Your reading activity
                        </p>
                    </div>
                </div>

                {/* Chart Area - Always visible now */}
                <div className="relative h-40">
                    {/* Chart Bars */}
                    <div className="flex h-full items-end justify-around gap-2 px-4">
                        {weeklyData.map((height, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                className="flex-1 rounded-t-lg bg-gradient-to-t from-accent-mint to-accent-sky"
                            />
                        ))}
                    </div>

                    {/* Days Labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4 -mb-6">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                            <span
                                key={i}
                                className="text-xs text-foreground/40 flex-1 text-center"
                            >
                                {day}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Insight Text - Always visible */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 flex items-center gap-2 rounded-xl bg-accent-mint/20 px-4 py-3"
                >
                    <TrendingUp className="h-4 w-4 text-accent-mint" />
                    <span className="text-sm">
                        <strong>+{percentChange}%</strong> more articles saved this week vs last week!
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
}
