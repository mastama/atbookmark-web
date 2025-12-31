"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Cpu, Brain } from "lucide-react";

export function PainPoints() {
    return (
        <section className="bg-surface py-20 px-4 border-y-2 border-border">
            <div className="mx-auto max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="font-display text-3xl font-bold mb-4 md:text-4xl">
                        Sound familiar? 🫠
                    </h2>
                    <p className="text-lg text-foreground/70 mb-12 max-w-2xl mx-auto">
                        Your browser is having a panic attack. We get it.
                    </p>
                </motion.div>

                {/* Warning Dialog Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="relative mx-auto max-w-lg"
                >
                    {/* System Warning Dialog */}
                    <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-brutal-lg">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-200">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-400" />
                                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                <div className="h-3 w-3 rounded-full bg-green-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">System Warning</span>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-display text-lg font-bold text-red-600 mb-2">
                                    Memory Full
                                </h3>
                                <ul className="space-y-2 text-sm text-foreground/70">
                                    <li className="flex items-center gap-2">
                                        <Cpu className="h-4 w-4 text-red-400" />
                                        Your browser is eating <strong className="text-foreground">4GB of RAM</strong>.
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-lg">📑</span>
                                        You have <strong className="text-foreground">50 tabs</strong> open "just in case".
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Brain className="h-4 w-4 text-red-400" />
                                        You can't find that <strong className="text-foreground">one article</strong> from last week.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl bg-accent-coral/20 -z-10" />
                </motion.div>
            </div>
        </section>
    );
}
