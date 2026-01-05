"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Folder, Loader2, FolderOpen, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrganization, FolderColor } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Extended colors list (25 colors for 5x5 grid)
const allColors: { value: string; className: string }[] = [
    // Grayscale
    { value: "slate", className: "bg-slate-400" },
    { value: "zinc", className: "bg-zinc-400" },
    { value: "neutral", className: "bg-neutral-400" },
    { value: "stone", className: "bg-stone-400" },
    { value: "red", className: "bg-red-400" },

    // Warm
    { value: "orange", className: "bg-orange-400" },
    { value: "amber", className: "bg-amber-400" },
    { value: "yellow", className: "bg-yellow-400" },
    { value: "lime", className: "bg-lime-400" },
    { value: "green", className: "bg-green-400" },

    // Cool / Nature
    { value: "emerald", className: "bg-emerald-400" },
    { value: "teal", className: "bg-teal-400" },
    { value: "cyan", className: "bg-cyan-400" },
    { value: "sky", className: "bg-sky-400" },
    { value: "blue", className: "bg-blue-400" },

    // Purple / Pink
    { value: "indigo", className: "bg-indigo-400" },
    { value: "violet", className: "bg-violet-400" },
    { value: "purple", className: "bg-purple-400" },
    { value: "fuchsia", className: "bg-fuchsia-400" },
    { value: "pink", className: "bg-pink-400" },

    // Pastel / Soft
    { value: "rose", className: "bg-rose-400" },
    { value: "mint", className: "bg-green-300" },
    { value: "lavender", className: "bg-purple-300" },
    { value: "coral", className: "bg-rose-300" },
    { value: "sky-soft", className: "bg-sky-300" },
];

export function CreateFolderModal({ isOpen, onClose }: CreateFolderModalProps) {
    // Removed isPro from hook
    const { addFolder, folders } = useOrganization();

    const [name, setName] = useState("");
    // Default color set to 'slate' or you can pick another default
    const [color, setColor] = useState<string>("slate");
    const [parentId, setParentId] = useState<string>("");
    const [saving, setSaving] = useState(false);

    // Get available parent folders
    const parentOptions = folders.filter((f) => f.type === "custom" && !f.parentId);

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Please enter a folder name");
            return;
        }

        setSaving(true);
        // Simulate network delay for UX
        await new Promise((r) => setTimeout(r, 500));

        // Always pass the selected color now
        const result = await addFolder(name, color as FolderColor, parentId || null);

        setSaving(false);

        if (result.success) {
            toast.success(`Folder "${name}" created! 📁`);
            setName("");
            setColor("slate"); // Reset to default
            setParentId("");
            onClose();
        } else if (result.error === "NAME_EXISTS") {
            toast.error("A folder with this name already exists");
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

                                {/* Color Picker - Unlocked for everyone */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Color Tag
                                    </label>

                                    <div className="grid grid-cols-5 gap-2">
                                        {allColors.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setColor(opt.value)}
                                                type="button"
                                                className={cn(
                                                    "relative h-8 w-full rounded-lg border-2 transition-all",
                                                    opt.className,
                                                    color === opt.value
                                                        ? "border-foreground ring-2 ring-foreground ring-offset-2"
                                                        : "border-transparent hover:border-foreground/30 hover:scale-105"
                                                )}
                                                title={opt.value}
                                            >
                                                {color === opt.value && (
                                                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
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