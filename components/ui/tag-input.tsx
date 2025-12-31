"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrganization, FolderColor } from "@/hooks/useOrganization";
import { toast } from "sonner";

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
    disabled?: boolean;
}

const tagColors: FolderColor[] = ["mint", "lavender", "coral", "sky", "yellow"];

const colorClasses: Record<FolderColor, string> = {
    mint: "bg-accent-mint",
    lavender: "bg-accent-lavender",
    coral: "bg-accent-coral",
    sky: "bg-accent-sky",
    yellow: "bg-secondary",
    gray: "bg-gray-200",
};

export function TagInput({
    value,
    onChange,
    placeholder = "Add tags...",
    maxTags = 10,
    disabled = false,
}: TagInputProps) {
    const { tags: globalTags, addTag, isPro } = useOrganization();
    const [inputValue, setInputValue] = useState("");
    const [limitError, setLimitError] = useState(false);
    const FREE_TAG_LIMIT = 3;

    const addTagToInput = (tagName: string) => {
        const trimmed = tagName.trim();
        if (!trimmed) return;

        const formattedName = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

        // Check if already selected in this input
        if (value.some((t) => t.toLowerCase() === formattedName.toLowerCase())) {
            return;
        }

        // Check max tags for this bookmark
        if (value.length >= maxTags) return;

        // Check if tag exists globally
        const existingTag = globalTags.find(
            (t) => t.name.toLowerCase() === formattedName.toLowerCase()
        );

        if (existingTag) {
            // Tag exists, just select it
            onChange([...value, existingTag.name]);
            setInputValue("");
            setLimitError(false);
        } else {
            // Tag doesn't exist - try to create it (Smart Auto-Create)
            const result = addTag(trimmed);

            if (result.success) {
                // Successfully created new tag
                toast.success(`Tag "${formattedName}" created ✨`);
                onChange([...value, formattedName]);
                setInputValue("");
                setLimitError(false);
            } else if (result.error === "LIMIT_REACHED") {
                // Free limit reached
                setLimitError(true);
                toast.error("Tag limit reached. Upgrade to Pro for unlimited tags!");
            } else if (result.error === "NAME_EXISTS") {
                // Race condition - tag was just created
                onChange([...value, formattedName]);
                setInputValue("");
                setLimitError(false);
            }
        }
    };

    const removeTag = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
        setLimitError(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTagToInput(inputValue);
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value.length - 1);
        }
    };

    const getTagColor = (tagName: string): FolderColor => {
        const existingTag = globalTags.find(
            (t) => t.name.toLowerCase() === tagName.toLowerCase()
        );
        if (existingTag) return existingTag.color;
        // Fallback to index-based color
        const index = value.indexOf(tagName);
        return tagColors[index % tagColors.length];
    };

    return (
        <div className="space-y-2">
            <div
                className={cn(
                    "flex flex-wrap items-center gap-2 rounded-xl border-2 bg-surface px-3 py-2 min-h-[48px] transition-all",
                    limitError ? "border-accent-coral" : "border-border",
                    "focus-within:border-primary focus-within:shadow-brutal-sm",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                {/* Selected Tags */}
                {value.map((tag, index) => (
                    <span
                        key={tag}
                        className={cn(
                            "inline-flex items-center gap-1 rounded-full border border-border/50 px-2 py-0.5 text-sm font-medium",
                            colorClasses[getTagColor(tag)]
                        )}
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="rounded-full hover:bg-black/10 p-0.5"
                            disabled={disabled}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}

                {/* Input */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setLimitError(false);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : ""}
                    disabled={disabled}
                    className="flex-1 min-w-[100px] bg-transparent text-sm outline-none placeholder:text-foreground/40"
                />
            </div>

            {/* Limit Error */}
            {limitError && (
                <p className="text-xs text-accent-coral">
                    Tag limit reached ({FREE_TAG_LIMIT} max for Free plan). Upgrade to Pro for unlimited!
                </p>
            )}

            <p className="text-xs text-foreground/40">
                Press Enter or comma to add. New tags are created automatically.
            </p>
        </div>
    );
}
