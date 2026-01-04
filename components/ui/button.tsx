"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "secondary" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const baseStyles =
            "inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 border-2 border-border";

        const variants = {
            primary: "bg-primary text-white hover:bg-primary/90",
            secondary: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary hover:bg-primary/20 dark:hover:bg-primary/30",
            ghost: "bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/10",
            outline: "bg-transparent border-border hover:bg-black/5 dark:hover:bg-white/10",
        };

        const sizes = {
            sm: "h-9 px-4 text-sm rounded-xl shadow-brutal-sm",
            md: "h-11 px-6 text-base rounded-xl shadow-brutal-md",
            lg: "h-14 px-8 text-lg rounded-xl shadow-brutal-md",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ y: -2, boxShadow: "6px 6px 0px #000000" }}
                whileTap={{ scale: 0.96, y: 0, boxShadow: "2px 2px 0px #000000" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button };
