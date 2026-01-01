"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Library,
    FolderOpen,
    Tag,
    Heart,
    TrendingUp,
    Lock,
    Sparkles,
} from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useOrganization } from "@/hooks/useOrganization";
import { ProModal } from "@/components/modals/ProModal";
import { cn } from "@/lib/utils";

interface StatItem {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}

export function StatsWidget() {
    const { bookmarks } = useBookmarks();
    const { isPro, folders, tags } = useOrganization();
    const [proModalOpen, setProModalOpen] = useState(false);

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

    return (
        <>
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

                {/* Pro Insights Section */}
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
                        {!isPro && (
                            <span className="ml-auto rounded-full bg-accent-lavender/30 px-2 py-0.5 text-xs font-bold">
                                PRO
                            </span>
                        )}
                    </div>

                    {/* Chart Area */}
                    <div className="relative h-40">
                        {/* Mock Chart */}
                        <div className="flex h-full items-end justify-around gap-2 px-4">
                            {[35, 50, 25, 70, 45, 80, 60].map((height, i) => (
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

                        {/* Blur Overlay for Free Users */}
                        {!isPro && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-surface/80 backdrop-blur-sm"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-secondary shadow-brutal-sm mb-3">
                                    <Lock className="h-5 w-5 text-foreground/60" />
                                </div>
                                <p className="mb-3 font-display font-bold text-foreground">
                                    Unlock Weekly Trends
                                </p>
                                <button
                                    onClick={() => setProModalOpen(true)}
                                    className="flex items-center gap-2 rounded-xl border-2 border-border bg-accent-lavender/30 px-4 py-2 text-sm font-bold transition-all hover:shadow-brutal-sm hover:-translate-y-0.5"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Upgrade to Pro
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Pro Insight Text */}
                    {isPro && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-8 flex items-center gap-2 rounded-xl bg-accent-mint/20 px-4 py-3"
                        >
                            <TrendingUp className="h-4 w-4 text-accent-mint" />
                            <span className="text-sm">
                                <strong>+23%</strong> more articles read this week vs last week!
                            </span>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
        </>
    );
}
