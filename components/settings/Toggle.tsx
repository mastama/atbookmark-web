"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleProps {
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
}

export function Toggle({ checked, disabled = false, onChange }: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-border transition-colors",
                checked ? "bg-primary" : "bg-gray-200",
                disabled && "cursor-not-allowed opacity-50"
            )}
        >
            <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 mt-0.5",
                    checked ? "ml-5" : "ml-0.5"
                )}
            />
        </button>
    );
}
