"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[100px] w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-base font-medium text-foreground placeholder:text-foreground/40 transition-all resize-none",
                    "focus:border-primary focus:outline-none focus:shadow-brutal-sm",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };
