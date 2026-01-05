"use client";

import { useParams } from "next/navigation";
import { FolderView } from "@/components/dashboard/FolderView";

export default function FolderDetailPage() {
    const params = useParams();
    const folderId = params.id as string;

    return <FolderView folderId={folderId} />;
}
