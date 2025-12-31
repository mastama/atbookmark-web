"use client";

import { motion } from "framer-motion";
import { Keyboard, Tags, Smartphone } from "lucide-react";

const steps = [
    {
        number: "1",
        title: "Snap",
        description: "User hits Alt+S",
        icon: Keyboard,
        color: "bg-primary text-white",
        visual: (
            <div className="flex items-center gap-1">
                <kbd className="rounded-lg border-2 border-border bg-surface px-3 py-1.5 font-mono text-sm shadow-brutal-sm">
                    Alt
                </kbd>
                <span className="text-foreground/50">+</span>
                <kbd className="rounded-lg border-2 border-border bg-surface px-3 py-1.5 font-mono text-sm shadow-brutal-sm">
                    S
                </kbd>
            </div>
        ),
    },
    {
        number: "2",
        title: "Sort",
        description: "AI categorization happens",
        icon: Tags,
        color: "bg-secondary text-foreground",
        visual: (
            <div className="flex flex-wrap gap-2">
                {["#React", "#Design", "#Tips"].map((tag, i) => (
                    <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        viewport={{ once: true }}
                        className="rounded-full bg-accent-mint px-2 py-0.5 text-xs font-bold border border-border"
                    >
                        {tag}
                    </motion.span>
                ))}
            </div>
        ),
    },
    {
        number: "3",
        title: "Sync",
        description: "Available on Phone & Desktop",
        icon: Smartphone,
        color: "bg-accent-mint text-foreground",
        visual: (
            <div className="flex items-center gap-2">
                <span className="text-2xl">💻</span>
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    viewport={{ once: true }}
                    className="text-primary"
                >
                    ↔
                </motion.span>
                <span className="text-2xl">📱</span>
            </div>
        ),
    },
];

export function HowItWorks() {
    return (
        <section className="bg-surface py-20 px-4 border-y-2 border-border">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-3xl font-bold md:text-4xl mb-4">
                        Three steps to freedom 🕊️
                    </h2>
                    <p className="text-lg text-foreground/70">
                        From tab chaos to organized bliss in seconds.
                    </p>
                </motion.div>

                <div className="relative grid gap-8 md:grid-cols-3">
                    {/* Connector Line (Desktop) */}
                    <div className="absolute top-20 left-[20%] right-[20%] hidden h-[2px] border-t-2 border-dashed border-border md:block" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-border ${step.color} shadow-brutal-md font-display text-2xl font-bold`}>
                                {step.number}
                            </div>
                            <h3 className="font-display text-2xl font-bold mb-2">{step.title}</h3>
                            <p className="text-foreground/70 mb-4">{step.description}</p>
                            <div className="mt-2">{step.visual}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
