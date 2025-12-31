"use client";

import { motion } from "framer-motion";
import { Library, Flame, Brain, TrendingDown, Clipboard, Sparkles, BookOpen } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookmarkCard } from "@/components/dashboard/BookmarkCard";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function DashboardPage() {
    const { bookmarks } = useBookmarks();

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="font-display text-3xl font-bold">Good morning! ☀️</h1>
                <p className="mt-1 text-foreground/60">
                    Here's what's happening in your second brain today.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Stashed"
                    value={String(bookmarks.length)}
                    icon={Library}
                    color="bg-accent-mint"
                    delay={0.1}
                />
                <StatCard
                    title="Reading Streak"
                    value="🔥 5 Days"
                    icon={Flame}
                    color="bg-secondary"
                    delay={0.15}
                />
                <StatCard
                    title="AI Insight"
                    value="#React week"
                    icon={Brain}
                    color="bg-accent-lavender"
                    delay={0.2}
                />
                <StatCard
                    title="Memory Saved"
                    value="1.2 GB"
                    icon={TrendingDown}
                    color="bg-accent-sky"
                    delay={0.25}
                />
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3"
            >
                <Button variant="outline" size="sm" className="gap-2">
                    <Clipboard className="h-4 w-4" />
                    Paste from Clipboard
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Tidy Up Inbox ({bookmarks.filter(b => b.folderId === "inbox").length})
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Continue Reading
                </Button>
            </motion.div>

            {/* Recent Bookmarks Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-center justify-between"
            >
                <h2 className="font-display text-xl font-bold">Recent Bookmarks</h2>
                <button className="text-sm font-medium text-primary hover:underline">
                    View All →
                </button>
            </motion.div>

            {/* Masonry Grid - Using Store Data */}
            {bookmarks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="mb-4 text-6xl">📚</div>
                    <h3 className="font-display text-xl font-bold">No bookmarks yet</h3>
                    <p className="mt-2 text-foreground/60">
                        Click "Add New" to save your first bookmark!
                    </p>
                </motion.div>
            ) : (
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                    {bookmarks.map((bookmark, i) => (
                        <BookmarkCard key={bookmark.id} bookmark={bookmark} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
