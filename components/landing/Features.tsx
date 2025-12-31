"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Bot, Snowflake, Plane, Search } from "lucide-react";

const features = [
    {
        icon: Bot,
        title: "🤖 The AI Librarian",
        subtitle: "Auto-Tagging",
        description: "No more manual tagging. Our AI scans the content and assigns #Programming, #Mathematics, or #Finance automatically.",
        color: "bg-accent-lavender",
        span: "md:col-span-2",
    },
    {
        icon: Snowflake,
        title: "🧠 RAM Rescuer",
        subtitle: "Tab Suspender",
        description: "One-click 'Bulk Save'. We close your 20 idle tabs and save them into a 'Session' folder instantly. Cool down your laptop.",
        color: "bg-accent-sky",
        span: "md:col-span-1",
    },
    {
        icon: Plane,
        title: "✈️ Offline Zen Reader",
        subtitle: "Read Anywhere",
        description: "Bad internet? No problem. We cache the article text so you can read ad-free, anywhere. Even in a tunnel.",
        color: "bg-accent-mint",
        span: "md:col-span-1",
    },
    {
        icon: Search,
        title: "🔍 Full-Brain Search",
        subtitle: "Content Search",
        description: "Don't just search titles. Search the content inside every webpage you've ever saved.",
        color: "bg-accent-peach",
        span: "md:col-span-2",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export function Features() {
    return (
        <section id="features" className="bg-background py-20 px-4">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-3xl font-bold md:text-4xl mb-4">
                        Not just bookmarks. <span className="text-primary">Superpowers.</span>
                    </h2>
                    <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                        We took the humble bookmark and gave it a brain, a freezer, and a search engine.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-6 md:grid-cols-3"
                >
                    {features.map((feature, i) => (
                        <motion.div key={i} variants={itemVariants} className={feature.span}>
                            <Card className="h-full p-6" hoverEffect>
                                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-border ${feature.color} shadow-brutal-sm`}>
                                    <feature.icon className="h-6 w-6 text-foreground" />
                                </div>
                                <div className="mb-1">
                                    <span className={`inline-block rounded-full ${feature.color} px-2 py-0.5 text-xs font-bold mb-2`}>
                                        {feature.subtitle}
                                    </span>
                                </div>
                                <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-foreground/70">{feature.description}</p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
