"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Tag, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagCard } from "@/components/dashboard/TagCard";
import { useOrganization } from "@/hooks/useOrganization";
import { useBulkSelect } from "@/hooks/useBulkSelect";
import { CreateTagModal } from "@/components/modals/CreateTagModal";
import { ProModal } from "@/components/modals/ProModal";
import { BulkToolbar } from "@/components/bulk/BulkToolbar";

const FREE_LIMIT = 3;

export default function TagsPage() {
    const { getSortedTags, isPro } = useOrganization();
    const [createOpen, setCreateOpen] = useState(false);
    const [proOpen, setProOpen] = useState(false);

    const tags = getSortedTags();

    const {
        selectedIds,
        isSelected,
        toggleSelection,
        selectAll,
        clearSelection,
        isSelectionMode,
        selectedCount,
    } = useBulkSelect();

    const handleNewTag = () => {
        if (!isPro && tags.length >= FREE_LIMIT) {
            setProOpen(true);
        } else {
            setCreateOpen(true);
        }
    };

    return (
        <div className="mx-auto max-w-5xl pb-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-start justify-between"
            >
                <div>
                    <h1 className="font-display text-3xl font-bold">All Tags</h1>
                    <p className="mt-1 text-foreground/60">Keywords for your brain.</p>
                </div>
                <div className="flex gap-2">
                    {/* Select All Button */}
                    {tags.length > 0 && (
                        <Button
                            variant={isSelectionMode ? "secondary" : "ghost"}
                            onClick={() =>
                                isSelectionMode
                                    ? clearSelection()
                                    : selectAll(tags)
                            }
                        >
                            <CheckSquare className="mr-2 h-4 w-4" />
                            {isSelectionMode ? `${selectedCount} selected` : "Select"}
                        </Button>
                    )}
                    <Button onClick={handleNewTag}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Tag
                        {!isPro && (
                            <span className="ml-2 text-xs opacity-70">
                                ({tags.length}/{FREE_LIMIT})
                            </span>
                        )}
                    </Button>
                </div>
            </motion.div>

            {/* Content - Tag Cloud */}
            {tags.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface">
                        <Tag className="h-12 w-12 text-foreground/30" />
                    </div>
                    <h3 className="font-display text-xl font-bold">No tags yet</h3>
                    <p className="mt-2 max-w-xs text-foreground/60">
                        Create tags to categorize your bookmarks.
                    </p>
                    <Button className="mt-6" onClick={handleNewTag}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Tag
                    </Button>
                </motion.div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {tags.map((tag, index) => (
                        <TagCard
                            key={tag.id}
                            tag={tag}
                            index={index}
                            isSelected={isSelected(tag.id)}
                            onSelect={toggleSelection}
                            selectionMode={isSelectionMode}
                        />
                    ))}
                </div>
            )}

            {/* Bulk Toolbar */}
            <BulkToolbar
                selectedIds={selectedIds}
                onClear={clearSelection}
                type="tags"
            />

            {/* Modals */}
            <CreateTagModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
            <ProModal isOpen={proOpen} onClose={() => setProOpen(false)} />
        </div>
    );
}
