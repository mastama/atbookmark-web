"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Command, Link2, ArrowRight, Sparkles } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { toast } from "sonner";

interface HomeHeaderProps {
    onSearchClick?: () => void;
}

const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const isValidUrl = (string: string): boolean => {
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

export function HomeHeader({ onSearchClick }: HomeHeaderProps) {
    const [captureUrl, setCaptureUrl] = useState("");
    const [isCapturing, setIsCapturing] = useState(false);
    const { addBookmark } = useBookmarks();

    const handleQuickCapture = useCallback(
        async (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && captureUrl.trim()) {
                if (!isValidUrl(captureUrl)) {
                    toast.error("Please enter a valid URL");
                    return;
                }

                setIsCapturing(true);
                try {
                    addBookmark({ url: captureUrl, folderId: "inbox" });
                    toast.success("Saved to Inbox! 📥", {
                        description: captureUrl,
                    });
                    setCaptureUrl("");
                } catch {
                    toast.error("Failed to save bookmark");
                } finally {
                    setIsCapturing(false);
                }
            }
        },
        [captureUrl, addBookmark]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Greeting */}
            <div>
                <h1 className="font-display text-3xl font-bold">
                    {getGreeting()}! ☀️
                </h1>
                <p className="mt-1 text-foreground/60">
                    Ready to organize your second brain?
                </p>
            </div>

            {/* Search & Quick Capture Row */}
            <div className="flex flex-col gap-3 sm:flex-row">
                {/* Global Search Trigger */}
                <button
                    onClick={onSearchClick}
                    className="group flex flex-1 items-center gap-3 rounded-xl border-2 border-border bg-surface px-4 py-3 text-left transition-all hover:border-primary hover:shadow-brutal-sm"
                >
                    <Search className="h-5 w-5 text-foreground/40 group-hover:text-primary transition-colors" />
                    <span className="flex-1 text-foreground/50">
                        Search bookmarks...
                    </span>
                    <div className="hidden items-center gap-1 rounded-lg border border-border bg-secondary/50 px-2 py-1 text-xs font-medium text-foreground/50 sm:flex">
                        <Command className="h-3 w-3" />
                        <span>K</span>
                    </div>
                </button>

                {/* Quick Capture Input */}
                <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-foreground/40" />
                    </div>
                    <input
                        type="text"
                        value={captureUrl}
                        onChange={(e) => setCaptureUrl(e.target.value)}
                        onKeyDown={handleQuickCapture}
                        placeholder="Paste link to save..."
                        disabled={isCapturing}
                        className="w-full rounded-xl border-2 border-dashed border-border bg-surface py-3 pl-11 pr-12 text-sm transition-all placeholder:text-foreground/40 focus:border-accent-mint focus:outline-none focus:ring-0 disabled:opacity-50 sm:w-72"
                    />
                    {captureUrl && isValidUrl(captureUrl) && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => {
                                const event = { key: "Enter" } as React.KeyboardEvent<HTMLInputElement>;
                                handleQuickCapture(event);
                            }}
                            className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-lg bg-accent-mint text-foreground transition-transform hover:scale-110"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Quick Action Hint */}
            <div className="flex items-center gap-2 text-xs text-foreground/40">
                <Sparkles className="h-3 w-3" />
                <span>Tip: Paste any URL and press Enter to save instantly</span>
            </div>
        </motion.div>
    );
}
