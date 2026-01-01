"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Puzzle,
    Chrome,
    Copy,
    Check,
    Zap,
    MousePointerClick,
    PanelRight,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const MOCK_API_KEY = "at_bk_live_8923489238492384923849238492384";

const features = [
    {
        icon: Zap,
        title: "Instant Save",
        description: "One-click save from any webpage. No popups, no friction.",
        color: "bg-amber-100 text-amber-600",
    },
    {
        icon: MousePointerClick,
        title: "Right-Click Context",
        description: "Save pages, links, or images via right-click menu.",
        color: "bg-sky-100 text-sky-600",
    },
    {
        icon: PanelRight,
        title: "Side Panel Access",
        description: "Quick access to your library without leaving the page.",
        color: "bg-violet-100 text-violet-600",
    },
];

const browsers = [
    { name: "Chrome", supported: true },
    { name: "Edge", supported: true },
    { name: "Brave", supported: true },
    { name: "Arc", supported: true },
    { name: "Firefox", supported: false },
    { name: "Safari", supported: false },
];

export default function ExtensionPage() {
    const [copied, setCopied] = useState(false);

    const handleCopyApiKey = async () => {
        try {
            await navigator.clipboard.writeText(MOCK_API_KEY);
            setCopied(true);
            toast.success("API Key copied to clipboard! 🔑");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy API Key");
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-8 lg:p-12">
            <div className="mx-auto max-w-4xl space-y-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-2 text-sm font-medium">
                        <Puzzle className="h-4 w-4 text-primary" />
                        Browser Extension
                    </div>

                    <h1 className="font-display text-4xl font-extrabold md:text-5xl lg:text-6xl mb-4">
                        Supercharge your{" "}
                        <span className="text-primary">browser.</span>
                    </h1>

                    <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
                        Save bookmarks instantly, access your library from any tab, and never lose a link again.
                    </p>

                    {/* Extension Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative mx-auto mb-8 max-w-md"
                    >
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-violet-500 to-pink-500 opacity-20 blur-xl" />
                        <Card className="relative overflow-hidden border-2 border-border bg-surface p-8">
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl shadow-brutal">
                                    🔖
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-xl font-bold">atBookmark</p>
                                    <p className="text-sm text-foreground/60">Browser Extension</p>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground/50">
                                <Chrome className="h-4 w-4" />
                                <span>v1.0.0 • Chromium Based</span>
                            </div>
                        </Card>
                    </motion.div>

                    <a
                        href="https://chrome.google.com/webstore"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold rounded-xl border-2 border-border bg-primary text-white hover:bg-primary/90 shadow-brutal-md transition-all hover:-translate-y-0.5"
                    >
                        <Chrome className="mr-2 h-5 w-5" />
                        Install on Chrome Web Store
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </motion.div>

                {/* API Key Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-2 border-border bg-surface p-6 md:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                <Puzzle className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h2 className="font-display text-xl font-bold mb-1">
                                    Connect Extension
                                </h2>
                                <p className="text-sm text-foreground/60 mb-4">
                                    Use this API key to connect your browser extension to your atBookmark account.
                                </p>

                                <div className="flex items-center gap-2">
                                    <div className="flex-1 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-4 py-3">
                                        <code className="font-mono text-sm text-foreground/80 select-all">
                                            {MOCK_API_KEY.slice(0, 28)}...
                                        </code>
                                    </div>
                                    <Button
                                        onClick={handleCopyApiKey}
                                        variant="outline"
                                        className="shrink-0 border-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <p className="mt-3 text-xs text-foreground/40">
                                    🔒 Keep this key private. It grants access to your bookmarks.
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="font-display text-2xl font-bold text-center mb-6">
                        Extension Features
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                <Card className="h-full border-2 border-border bg-surface p-6 transition-all hover:shadow-brutal hover:-translate-y-1">
                                    <div
                                        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                                    >
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-display text-lg font-bold mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-foreground/60">
                                        {feature.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Browser Support */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <h2 className="font-display text-2xl font-bold mb-2">
                        Browser Support
                    </h2>
                    <p className="text-foreground/60 mb-6">
                        Works on all Chromium-based browsers
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {browsers.map((browser) => (
                            <div
                                key={browser.name}
                                className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all ${browser.supported
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                    : "border-border bg-secondary/30 text-foreground/40"
                                    }`}
                            >
                                <span>{browser.name}</span>
                                {browser.supported ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span className="text-xs">(Soon)</span>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Help Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center text-sm text-foreground/50"
                >
                    <p>
                        Need help setting up?{" "}
                        <a href="#" className="text-primary hover:underline">
                            View documentation →
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
