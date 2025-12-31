"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
    hoverEffect?: boolean;
    shadowSize?: "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = false, shadowSize = "md", children, ...props }, ref) => {
        const shadows = {
            sm: "shadow-brutal-sm",
            md: "shadow-brutal-md",
            lg: "shadow-brutal-lg",
        };

        return (
            <motion.div
                ref={ref}
                className={cn(
                    "rounded-2xl border-2 border-border bg-surface",
                    shadows[shadowSize],
                    className
                )}
                whileHover={hoverEffect ? { y: -4, boxShadow: "6px 6px 0px #000000" } : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Card.displayName = "Card";

export { Card };
