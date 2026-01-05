"use client";

import { useEffect } from "react";
import { FolderView } from "@/components/dashboard/FolderView";
import { useOrganization } from "@/hooks/useOrganization";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InboxPage() {
    const { folders, isLoading } = useOrganization();
    const router = useRouter();

    // Find the system inbox folder
    const inboxFolder = folders.find(f => f.type === 'system' && f.name === 'Inbox');

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!inboxFolder) {
        return <div className="p-8">Inbox not found. Please try creating a bookmark to regenerate it.</div>;
    }

    // Reuse the generic FolderView but pass the Inbox ID
    return <FolderView folderId={inboxFolder.id} />;
}
