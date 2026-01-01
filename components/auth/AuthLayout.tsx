"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bookmark, Sparkles } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    footerText: string;
    footerLinkText: string;
    footerLinkHref: string;
}

export function AuthLayout({
    children,
    title,
    subtitle,
    footerText,
    footerLinkText,
    footerLinkHref,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-[40%] bg-primary relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-secondary/30 blur-2xl" />
                    <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-accent-mint/30 blur-2xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-accent-lavender/20 blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-3xl">🔖</span>
                        <span className="font-display text-2xl font-bold">atBookmark</span>
                    </Link>

                    {/* Quote */}
                    <div className="max-w-sm">
                        <p className="text-2xl font-display font-bold leading-relaxed mb-4">
                            "I went from 500 tabs to zero. My laptop fan finally stopped screaming."
                        </p>
                        <p className="text-white/70 font-medium">— A Reformed Tab Hoarder</p>
                    </div>

                    {/* Floating Cards Preview */}
                    <div className="flex gap-3">
                        {["#React", "#Design", "#AI"].map((tag, i) => (
                            <motion.div
                                key={tag}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-bold border border-white/30"
                            >
                                {tag}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <span className="text-2xl">🔖</span>
                        <span className="font-display text-xl font-bold">atBookmark</span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-bold mb-2">{title}</h1>
                        <p className="text-foreground/60">{subtitle}</p>
                    </div>

                    {/* Form Content */}
                    {children}

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-foreground/60">
                        {footerText}{" "}
                        <Link
                            href={footerLinkHref}
                            className="font-semibold text-primary hover:underline"
                        >
                            {footerLinkText}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
