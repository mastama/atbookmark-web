"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { useOrganization, FolderColor } from "@/hooks/useOrganization";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkCard } from "@/components/dashboard/BookmarkCard";
import { cn } from "@/lib/utils";

const colorClasses: Record<FolderColor, string> = {
    mint: "bg-accent-mint",
    lavender: "bg-accent-lavender",
    coral: "bg-accent-coral",
    sky: "bg-accent-sky",
    yellow: "bg-secondary",
    gray: "bg-gray-200",
};

export default function TagDetailPage() {
    const params = useParams();
    const tagId = params.id as string;
    const { getTagById } = useOrganization();
    const { bookmarks } = useBookmarks();

    const tag = getTagById(tagId);

    // Filter bookmarks by tag label
    const tagBookmarks = tag
        ? bookmarks.filter((b) =>
            b.tags.some((t) => t.label.toLowerCase() === tag.name.toLowerCase())
        )
        : [];

    if (!tag) {
        return (
            <div className="mx-auto max-w-5xl pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface">
                        <Tag className="h-12 w-12 text-foreground/30" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Tag not found</h3>
                    <p className="mt-2 text-foreground/60">
                        This tag doesn&apos;t exist or has been deleted.
                    </p>
                    <Link
                        href="/dashboard/tags"
                        className="mt-6 flex items-center gap-2 text-primary hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tags
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl pb-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Link
                    href="/dashboard/tags"
                    className="mb-4 inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tags
                </Link>

                <div className="flex items-center gap-4">
                    <span
                        className={cn(
                            "rounded-full border-2 border-border px-5 py-2 text-xl font-bold",
                            colorClasses[tag.color]
                        )}
                    >
                        {tag.name}
                    </span>
                    <p className="text-foreground/60">
                        {tagBookmarks.length} bookmark{tagBookmarks.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </motion.div>

            {/* Content */}
            {tagBookmarks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface">
                        <Tag className="h-12 w-12 text-foreground/30" />
                    </div>
                    <h3 className="font-display text-xl font-bold">No bookmarks with this tag</h3>
                    <p className="mt-2 max-w-xs text-foreground/60">
                        Add the {tag.name} tag to bookmarks to see them here.
                    </p>
                </motion.div>
            ) : (
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                    {tagBookmarks.map((bookmark, index) => (
                        <div key={bookmark.id} className="mb-4 break-inside-avoid">
                            <BookmarkCard bookmark={bookmark} index={index} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
