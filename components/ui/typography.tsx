import * as React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant?: "h1" | "h2" | "h3" | "h4" | "body" | "small" | "caption" | "display";
    component?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant = "body", component, ...props }, ref) => {
        const Component = component ||
            (variant === "display" ? "h1" :
                variant === "h1" ? "h1" :
                    variant === "h2" ? "h2" :
                        variant === "h3" ? "h3" :
                            variant === "h4" ? "h4" : "p");

        const variants = {
            display: "font-display text-5xl md:text-6xl font-bold leading-[1.1]",
            h1: "font-display text-4xl font-bold leading-tight",
            h2: "font-display text-3xl font-bold leading-tight",
            h3: "font-display text-2xl font-semibold leading-snug",
            h4: "font-display text-xl font-semibold leading-snug",
            body: "font-sans text-base leading-relaxed text-secondary-foreground",
            small: "font-sans text-sm font-medium leading-none",
            caption: "font-sans text-xs text-muted-foreground",
        };

        return (
            <Component
                ref={ref as any}
                className={cn(variants[variant], className)}
                {...props}
            />
        );
    }
);
Typography.displayName = "Typography";

export { Typography };
