"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const benefits = [
    "🌙 Dark Mode",
    "🤖 Unlimited AI Summaries",
    "📊 Advanced Analytics",
    "☁️ Unlimited Cloud Storage",
    "🚀 Priority Support",
];

export function ProModal({ isOpen, onClose }: ProModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-brutal-lg">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Header */}
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border bg-secondary shadow-brutal-sm">
                                    <Sparkles className="h-7 w-7" />
                                </div>
                                <h2 className="font-display text-2xl font-bold">Unlock the Full Brain 🧠</h2>
                                <p className="mt-2 text-sm text-foreground/60">
                                    Upgrade to Pro and supercharge your knowledge collection.
                                </p>
                            </div>

                            {/* Benefits */}
                            <ul className="mb-6 space-y-3">
                                {benefits.map((benefit) => (
                                    <li key={benefit} className="flex items-center gap-3 text-sm">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-mint">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Button className="w-full" size="lg">
                                Upgrade for $4/mo
                            </Button>
                            <button
                                onClick={onClose}
                                className="mt-3 w-full text-center text-sm text-foreground/50 hover:text-foreground"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
