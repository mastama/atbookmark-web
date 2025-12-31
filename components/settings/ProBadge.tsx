"use client";

import { Sparkles } from "lucide-react";

export function ProBadge() {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
            <Sparkles className="h-3 w-3" />
            PRO
        </span>
    );
}
