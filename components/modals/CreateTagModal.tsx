"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrganization } from "@/hooks/useOrganization";

interface CreateTagModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateTagModal({ isOpen, onClose }: CreateTagModalProps) {
    const { addTag } = useOrganization();
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Please enter a tag name");
            return;
        }

        setSaving(true);
        await new Promise((r) => setTimeout(r, 500));

        const result = await addTag(name);

        setSaving(false);

        if (result.success) {
            const tagName = name.startsWith("#") ? name : `#${name}`;
            toast.success(`Tag "${tagName}" created! 🏷️`);
            setName("");
            onClose();
        } else if (result.error === "NAME_EXISTS") {
            toast.error("This tag already exists");
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
                        <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-brutal-lg">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-display text-xl font-bold">Create Tag 🏷️</h2>
                                <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Tag Name</label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., React"
                                    icon={<Tag className="h-5 w-5" />}
                                    autoFocus
                                />
                                <p className="mt-2 text-xs text-foreground/50">
                                    # will be added automatically
                                </p>
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
                                        "Create Tag"
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
