"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";
        const inputType = isPassword ? (showPassword ? "text" : "password") : type;

        return (
            <div className="relative">
                {icon && (
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50">
                        {icon}
                    </div>
                )}
                <input
                    type={inputType}
                    className={cn(
                        "flex h-12 w-full rounded-xl border-2 border-border bg-surface px-4 py-2 text-base font-medium text-foreground placeholder:text-foreground/40 transition-all",
                        "focus:border-primary focus:outline-none focus:shadow-brutal-sm focus:scale-[1.01]",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        icon && "pl-12",
                        isPassword && "pr-12",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
