"use client";

import { cn } from "@/lib/utils";

interface SettingsSectionProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    danger?: boolean;
}

export function SettingsSection({ title, subtitle, children, danger = false }: SettingsSectionProps) {
    return (
        <div
            className={cn(
                "rounded-xl border-2 bg-surface p-6",
                danger
                    ? "border-accent-coral bg-accent-coral/5 shadow-[4px_4px_0px_#FB7185]"
                    : "border-border shadow-brutal-md"
            )}
        >
            <div className="mb-6">
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="text-sm text-foreground/60">{subtitle}</p>
            </div>
            {children}
        </div>
    );
}
