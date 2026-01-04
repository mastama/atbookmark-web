"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Play, TrendingDown, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { InstallExtensionButton } from "@/components/landing/InstallExtensionButton";

export function Hero() {
    const { user } = useAuth();

    return (
        <section className="relative overflow-hidden bg-background px-4 py-16 md:py-24 lg:py-32">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <h1 className="font-display text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                        Save Less.{" "}
                        <span className="text-primary">Remember More.</span>
                    </h1>

                    <p className="max-w-lg text-lg text-foreground/70 md:text-xl">
                        The AI-powered bookmark manager that frees your RAM, summarizes your reading, and organizes your chaos automatically.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                        {user ? (
                            <Link href="/dashboard">
                                <Button size="lg">
                                    <ArrowRight className="mr-2 h-5 w-5" />
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/register">
                                <Button size="lg">
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Save Your First Link
                                </Button>
                            </Link>
                        )}
                        <Button size="lg" variant="outline">
                            <Play className="mr-2 h-5 w-5" />
                            View the Demo
                        </Button>
                    </div>
                </motion.div>

                {/* Right Visual: Chaos to Order Animation */}
                <div className="relative mx-auto h-[400px] w-full max-w-md lg:h-[500px]">
                    {/* Background Gradient Blobs */}
                    <div className="absolute top-10 right-10 h-48 w-48 rounded-full bg-accent-lavender/40 blur-3xl" />
                    <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-accent-mint/40 blur-3xl" />

                    {/* Messy Tabs (Before) - fades out */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {[
                            { x: -40, y: -30, rotate: -12 },
                            { x: 35, y: -20, rotate: 8 },
                            { x: -20, y: 25, rotate: -5 },
                            { x: 45, y: 15, rotate: 10 },
                            { x: 0, y: -10, rotate: -3 },
                        ].map((offset, i) => (
                            <motion.div
                                key={`tab-${i}`}
                                initial={{
                                    x: offset.x,
                                    y: offset.y,
                                    rotate: offset.rotate,
                                    opacity: 1
                                }}
                                animate={{
                                    x: 0,
                                    y: 0,
                                    rotate: 0,
                                    opacity: 0,
                                    scale: 0.5
                                }}
                                transition={{
                                    delay: 0.5 + i * 0.2,
                                    duration: 0.8,
                                    repeat: Infinity,
                                    repeatDelay: 4
                                }}
                                className="absolute w-48 rounded-t-lg border-2 border-border bg-surface p-2 shadow-brutal-sm"
                                style={{ zIndex: 5 - i }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-gray-300" />
                                        <div className="h-2 w-20 rounded bg-gray-200" />
                                    </div>
                                    <X className="h-3 w-3 text-gray-400" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Clean Bento Grid + Badge Wrapper (After) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2, duration: 0.5, repeat: Infinity, repeatDelay: 4 }}
                            className="flex w-fit flex-col items-end gap-4"
                        >
                            {/* RAM Badge - flush right with grid */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2.5, type: "spring" }}
                            >
                                <div className="flex items-center gap-2 rounded-full border-2 border-border bg-accent-mint px-4 py-2 shadow-brutal-sm">
                                    <TrendingDown className="h-4 w-4 text-green-800" />
                                    <span className="text-sm font-bold text-green-800">RAM Usage: -80% 📉</span>
                                </div>
                            </motion.div>

                            {/* Card Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { color: "bg-accent-mint", label: "#Mathematics" },
                                    { color: "bg-accent-lavender", label: "#Programming" },
                                    { color: "bg-accent-sky", label: "#Finance" },
                                    { color: "bg-accent-coral", label: "#Cooking" },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 2.2 + i * 0.1 }}
                                    >
                                        <Card className="p-4" shadowSize="sm">
                                            <div className={`mb-2 h-16 w-full rounded-lg ${item.color}`} />
                                            <div className="h-2 w-3/4 rounded bg-gray-200 mb-1" />
                                            <span className={`inline-block rounded-full ${item.color} px-2 py-0.5 text-xs font-bold`}>
                                                {item.label}
                                            </span>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
