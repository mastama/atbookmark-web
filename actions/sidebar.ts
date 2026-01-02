"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SidebarFolder {
    id: string;
    name: string;
    type: "system" | "custom";
    color: string;
    parent_id: string | null;
}

export interface SidebarTag {
    id: string;
    name: string;
    color: string;
}

export interface SidebarData {
    folders: SidebarFolder[];
    tags: SidebarTag[];
    isPro: boolean;
    userId: string | null;
}

/**
 * Build folder tree hierarchy from flat list
 */
function buildFolderTree(folders: SidebarFolder[]): SidebarFolder[] {
    // Sort folders by name (Inbox/system folders will be handled separately in UI)
    const sorted = [...folders].sort((a, b) => a.name.localeCompare(b.name));

    // Get root folders (no parent)
    const rootFolders = sorted.filter(f => f.parent_id === null);

    return rootFolders;
}

/**
 * Ensure the Inbox folder exists for a user (lazy creation)
 * Creates it with type: 'system' so it cannot be deleted
 */
async function ensureInboxFolder(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<void> {
    // Check if Inbox already exists
    const { data: existingInbox } = await supabase
        .from("folders")
        .select("id")
        .eq("user_id", userId)
        .eq("name", "Inbox")
        .eq("type", "system")
        .single();

    if (existingInbox) {
        return; // Already exists
    }

    // Create Inbox folder
    const { error } = await supabase.from("folders").insert({
        user_id: userId,
        name: "Inbox",
        type: "system",
        color: "sky",
        parent_id: null,
    });

    if (error) {
        console.error("Error creating Inbox folder:", error);
    }
}

/**
 * Get sidebar data for the current authenticated user
 */
export async function getSidebarData(): Promise<SidebarData> {
    const supabase = await createClient();

    // Get current user session
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            folders: [],
            tags: [],
            isPro: false,
            userId: null,
        };
    }

    // Ensure Inbox folder exists (lazy creation)
    await ensureInboxFolder(supabase, user.id);

    // Fetch user's is_pro status from users table
    const { data: userData } = await supabase
        .from("users")
        .select("is_pro")
        .eq("id", user.id)
        .single();

    // Fetch folders for this user
    const { data: foldersData, error: foldersError } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

    if (foldersError) {
        console.error("Error fetching folders:", foldersError);
    }

    // Fetch tags for this user
    const { data: tagsData, error: tagsError } = await supabase
        .from("tags")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

    if (tagsError) {
        console.error("Error fetching tags:", tagsError);
    }

    // Transform database fields to match our interface
    const folders: SidebarFolder[] = (foldersData || []).map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type || "custom",
        color: f.color || "gray",
        parent_id: f.parent_id,
    }));

    const tags: SidebarTag[] = (tagsData || []).map((t) => ({
        id: t.id,
        name: t.name,
        color: t.color || "gray",
    }));

    return {
        folders: buildFolderTree(folders),
        tags,
        isPro: userData?.is_pro ?? false,
        userId: user.id,
    };
}

/**
 * Create a new folder in the database
 */
export async function createFolder(
    name: string,
    color: string = "gray",
    parentId: string | null = null
): Promise<{ success: boolean; folder?: SidebarFolder; error?: string }> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "NOT_AUTHENTICATED" };
    }

    // Check if folder name already exists for this user
    const { data: existing } = await supabase
        .from("folders")
        .select("id")
        .eq("user_id", user.id)
        .ilike("name", name)
        .single();

    if (existing) {
        return { success: false, error: "NAME_EXISTS" };
    }

    // Insert the folder
    const { data, error } = await supabase
        .from("folders")
        .insert({
            user_id: user.id,
            name,
            type: "custom",
            color,
            parent_id: parentId,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating folder:", error);
        return { success: false, error: "DATABASE_ERROR" };
    }

    // Revalidate to refresh server cache
    revalidatePath("/dashboard");

    const folder: SidebarFolder = {
        id: data.id,
        name: data.name,
        type: data.type,
        color: data.color,
        parent_id: data.parent_id,
    };

    return { success: true, folder };
}

/**
 * Create a new tag in the database
 */
export async function createTag(
    name: string,
    color: string = "gray"
): Promise<{ success: boolean; tag?: SidebarTag; error?: string }> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "NOT_AUTHENTICATED" };
    }

    // Ensure tag name starts with #
    const tagName = name.startsWith("#") ? name : `#${name}`;

    // Check if tag already exists for this user
    const { data: existing } = await supabase
        .from("tags")
        .select("id")
        .eq("user_id", user.id)
        .ilike("name", tagName)
        .single();

    if (existing) {
        return { success: false, error: "NAME_EXISTS" };
    }

    // Insert the tag
    const { data, error } = await supabase
        .from("tags")
        .insert({
            user_id: user.id,
            name: tagName,
            color,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating tag:", error);
        return { success: false, error: "DATABASE_ERROR" };
    }

    // Revalidate to refresh server cache
    revalidatePath("/dashboard");

    const tag: SidebarTag = {
        id: data.id,
        name: data.name,
        color: data.color,
    };

    return { success: true, tag };
}

/**
 * Update user profile (display name and optionally avatar URL)
 */
export async function updateUserProfile(
    displayName: string,
    avatarUrl?: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "NOT_AUTHENTICATED" };
    }

    // Build update object
    const updateData: { full_name?: string; image?: string } = {};

    if (displayName) {
        updateData.full_name = displayName;
    }

    if (avatarUrl) {
        updateData.image = avatarUrl;
    }

    // Update user in database
    const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", user.id);

    if (error) {
        console.error("Error updating user profile:", error);
        return { success: false, error: "DATABASE_ERROR" };
    }

    // Revalidate to refresh server cache
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return { success: true };
}

/**
 * Get bookmark count for a specific folder
 */
export async function getFolderBookmarkCount(folderId: string): Promise<number> {
    const supabase = await createClient();

    const { count, error } = await supabase
        .from("bookmarks")
        .select("*", { count: "exact", head: true })
        .eq("folder_id", folderId)
        .eq("is_trashed", false);

    if (error) {
        console.error("Error fetching bookmark count:", error);
        return 0;
    }

    return count || 0;
}

/**
 * Get child folders for a parent folder
 */
export async function getChildFolders(parentId: string): Promise<SidebarFolder[]> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .eq("parent_id", parentId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching child folders:", error);
        return [];
    }

    return (data || []).map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type || "custom",
        color: f.color || "gray",
        parent_id: f.parent_id,
    }));
}

