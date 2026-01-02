"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Folder, Loader2, FolderOpen, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrganization, FolderColor } from "@/hooks/useOrganization";
import { createFolder as createFolderAction } from "@/actions/sidebar";
import { cn } from "@/lib/utils";

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Basic colors for free users
const basicColors: { value: FolderColor; className: string }[] = [
    { value: "mint", className: "bg-green-300" },
    { value: "lavender", className: "bg-purple-300" },
    { value: "coral", className: "bg-rose-300" },
    { value: "sky", className: "bg-sky-300" },
    { value: "yellow", className: "bg-amber-300" },
];

// Extended colors for Pro users (4x5 grid)
const proColors: { value: string; className: string }[] = [
    { value: "red", className: "bg-red-400" },
    { value: "orange", className: "bg-orange-400" },
    { value: "amber", className: "bg-amber-400" },
    { value: "yellow", className: "bg-yellow-400" },
    { value: "lime", className: "bg-lime-400" },
    { value: "green", className: "bg-green-400" },
    { value: "emerald", className: "bg-emerald-400" },
    { value: "teal", className: "bg-teal-400" },
    { value: "cyan", className: "bg-cyan-400" },
    { value: "sky", className: "bg-sky-400" },
    { value: "blue", className: "bg-blue-400" },
    { value: "indigo", className: "bg-indigo-400" },
    { value: "violet", className: "bg-violet-400" },
    { value: "purple", className: "bg-purple-400" },
    { value: "fuchsia", className: "bg-fuchsia-400" },
    { value: "pink", className: "bg-pink-400" },
    { value: "rose", className: "bg-rose-400" },
    { value: "slate", className: "bg-slate-400" },
    { value: "gray", className: "bg-gray-400" },
    { value: "neutral", className: "bg-neutral-400" },
];

export function CreateFolderModal({ isOpen, onClose }: CreateFolderModalProps) {
    const { isPro, folders } = useOrganization();
    const [name, setName] = useState("");
    const [color, setColor] = useState<FolderColor>("mint");
    const [parentId, setParentId] = useState<string>("");
    const [saving, setSaving] = useState(false);

    // Get available parent folders (only custom folders, no nested nesting for simplicity)
    const parentOptions = folders.filter((f) => f.type === "custom" && !f.parentId);

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Please enter a folder name");
            return;
        }

        setSaving(true);

        // Call server action to persist to database
        const result = await createFolderAction(
            name,
            isPro ? color : "gray",
            parentId || null
        );

        setSaving(false);

        if (result.success && result.folder) {
            // Update local Zustand store for immediate UI feedback
            useOrganization.setState((state) => ({
                folders: [...state.folders, {
                    id: result.folder!.id,
                    name: result.folder!.name,
                    type: result.folder!.type,
                    color: result.folder!.color,
                    count: 0,
                    isPinned: false, // Default to false since column doesn't exist
                    parentId: result.folder!.parent_id,
                }],
            }));

            toast.success(`Folder "${name}" created! 📁`);
            setName("");
            setColor("mint");
            setParentId("");
            onClose();
        } else if (result.error === "NAME_EXISTS") {
            toast.error("A folder with this name already exists");
        } else if (result.error === "NOT_AUTHENTICATED") {
            toast.error("Please log in to create folders");
        } else {
            toast.error("Failed to create folder. Please try again.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-brutal-lg max-h-[90vh] overflow-y-auto">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-display text-xl font-bold">Create Folder 📁</h2>
                                <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Folder Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Folder Name</label>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Inspiration"
                                        icon={<Folder className="h-5 w-5" />}
                                        autoFocus
                                    />
                                </div>

                                {/* Parent Folder (Optional) */}
                                {parentOptions.length > 0 && (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Parent Folder
                                            <span className="ml-2 text-xs text-foreground/50">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <FolderOpen className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                                            <select
                                                value={parentId}
                                                onChange={(e) => setParentId(e.target.value)}
                                                className="flex h-12 w-full appearance-none rounded-xl border-2 border-border bg-surface pl-12 pr-4 text-base font-medium focus:border-primary focus:outline-none"
                                            >
                                                <option value="">None (Root folder)</option>
                                                {parentOptions.map((f) => (
                                                    <option key={f.id} value={f.id}>
                                                        {f.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Color Picker */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Color
                                        {!isPro && (
                                            <span className="ml-2 text-xs text-foreground/50">(Random for Free plan)</span>
                                        )}
                                    </label>

                                    {isPro ? (
                                        // Pro: Full color grid
                                        <div className="grid grid-cols-5 gap-2">
                                            {proColors.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setColor(opt.value as FolderColor)}
                                                    className={cn(
                                                        "relative h-8 w-full rounded-lg border-2 transition-all",
                                                        opt.className,
                                                        color === opt.value
                                                            ? "border-foreground ring-2 ring-foreground ring-offset-2"
                                                            : "border-transparent hover:border-foreground/30"
                                                    )}
                                                >
                                                    {color === opt.value && (
                                                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        // Free: Basic pastel colors (disabled)
                                        <div className="flex gap-2">
                                            {basicColors.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    disabled
                                                    className={cn(
                                                        "h-8 w-8 rounded-lg border-2 border-transparent",
                                                        opt.className,
                                                        "opacity-50 cursor-not-allowed"
                                                    )}
                                                    title="Upgrade to Pro for custom colors"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="ghost" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreate} disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Folder"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
