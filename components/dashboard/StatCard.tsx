"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
    delay?: number;
}

export function StatCard({ title, value, icon: Icon, color, delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={cn(
                "rounded-2xl border-2 border-border bg-surface p-5 shadow-brutal-sm",
                "hover:shadow-brutal-md hover:-translate-y-1 transition-all cursor-default"
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-foreground/60">{title}</p>
                    <p className="mt-1 font-display text-2xl font-bold">{value}</p>
                </div>
                <div
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border",
                        color
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </motion.div>
    );
}
