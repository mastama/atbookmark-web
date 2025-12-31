"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link as LinkIcon, FolderOpen, Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";
import { useOrganization } from "@/hooks/useOrganization";
import { useBookmarks } from "@/hooks/useBookmarks";

interface AddBookmarkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddBookmarkModal({ isOpen, onClose }: AddBookmarkModalProps) {
    const { folders } = useOrganization();
    const { addBookmark } = useBookmarks();
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [folderId, setFolderId] = useState("inbox");
    const [tags, setTags] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!url.trim()) {
            toast.error("Please enter a URL");
            return;
        }

        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));

        // Add bookmark to store
        addBookmark({
            url: url.trim(),
            title: title.trim() || undefined,
            folderId: folderId || "inbox",
            tags: tags,
        });

        setSaving(false);

        const folderName = folders.find(f => f.id === folderId)?.name || "Inbox";
        toast.success(`Saved to ${folderName}! 🔖`);

        // Reset form
        setUrl("");
        setTitle("");
        setFolderId("inbox");
        setTags([]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-brutal-lg max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-display text-xl font-bold">Save a new gem 💎</h2>
                                <button
                                    onClick={onClose}
                                    className="rounded-lg p-1 hover:bg-gray-100"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">URL</label>
                                    <Input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://..."
                                        icon={<LinkIcon className="h-5 w-5" />}
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Title (Optional)</label>
                                    <Input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Auto-fetched if empty"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Folder</label>
                                    <div className="relative">
                                        <FolderOpen className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                                        <select
                                            value={folderId}
                                            onChange={(e) => setFolderId(e.target.value)}
                                            className="flex h-12 w-full appearance-none rounded-xl border-2 border-border bg-surface pl-12 pr-4 text-base font-medium focus:border-primary focus:outline-none"
                                        >
                                            {folders.map((f) => (
                                                <option key={f.id} value={f.id}>
                                                    {f.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Tags Input */}
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                        <Tag className="h-4 w-4" />
                                        Tags (Optional)
                                    </label>
                                    <TagInput
                                        value={tags}
                                        onChange={setTags}
                                        placeholder="Add tags..."
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="ghost" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Bookmark"
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
