"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { useBookmarks, Bookmark } from "@/hooks/useBookmarks";
import { BookmarkCard } from "@/components/dashboard/BookmarkCard";
import { useRouter } from "next/navigation";

const MAX_ITEMS = 8;

interface RecentWidgetProps {
    viewMode?: "grid" | "list";
}

export function RecentWidget({ viewMode = "grid" }: RecentWidgetProps) {
    const { bookmarks } = useBookmarks();
    const router = useRouter();

    // Get recent items sorted by createdAt (EXCLUDE archived and trashed)
    const recentItems = [...bookmarks]
        .filter((b) => !b.isTrashed && !b.archived)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, MAX_ITEMS);

    if (recentItems.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-accent-coral/30 shadow-brutal-sm">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold">
                            Recent
                        </h3>
                        <p className="text-sm text-foreground/60">
                            Recently saved bookmarks
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => router.push("/dashboard/library")}
                    className="flex items-center gap-1 text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
                >
                    View all
                    <ArrowRight className="h-4 w-4" />
                </button>

            </div>

            {/* Grid/List View */}
            {viewMode === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {recentItems.map((bookmark, index) => (
                        <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {recentItems.map((bookmark, index) => (
                        <CompactBookmarkItem
                            key={bookmark.id}
                            bookmark={bookmark}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}

interface CompactBookmarkItemProps {
    bookmark: Bookmark;
    index: number;
}

function CompactBookmarkItem({ bookmark, index }: CompactBookmarkItemProps) {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`;

    return (
        <motion.a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.03 }}
            className="group flex items-center gap-4 rounded-xl border-2 border-border bg-surface p-4 transition-all hover:border-primary hover:shadow-brutal-sm hover:-translate-y-0.5"
        >
            {/* Cover Image */}
            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                <img
                    src={bookmark.coverImage}
                    alt=""
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${bookmark.domain}&background=C4B5FD&color=6366F1`;
                    }}
                />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                    <img
                        src={faviconUrl}
                        alt=""
                        className="h-4 w-4 rounded-sm"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <span className="text-xs text-foreground/50">{bookmark.domain}</span>
                </div>
                <h4 className="line-clamp-1 font-display font-bold text-foreground group-hover:text-primary transition-colors">
                    {bookmark.title}
                </h4>
                <div className="mt-1 flex flex-wrap gap-1">
                    {bookmark.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag.id}
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${tag.color}`}
                        >
                            {tag.label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Meta */}
            <div className="flex-shrink-0 text-right">
                <span className="text-xs text-foreground/40">{bookmark.readingTime}</span>
            </div>
        </motion.a>
    );
}
