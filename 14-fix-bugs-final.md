# Critical Fixes: Sync, Nesting, & Sidebar Logic

**Context:**
The current Sidebar implementation has bugs regarding data synchronization, folder nesting logic, and visibility rules for Free vs Pro users.

## 1. FIX COUNT MISMATCH (Sync Issue)
**Problem:** The count in Sidebar (`Inbox: 4`) does not match the page (`Inbox: 0`).
**Cause:** The Sidebar is likely counting *Trashed* items, whereas the Page filters them out.
**Fix:**
Update `useBookmarks.ts` (or the store selector) to ensure the `getBookmarkCount` function strictly enforces:
`item.folderId === folderId && !item.isTrashed`.

## 2. NESTED FOLDERS & DRAG-DROP
**Problem:** Nesting via Drag & Drop works in UI but might not persist or validate correctly. Creation of nested folders is missing.
**Fixes:**
1.  **Sidebar DnD:** Ensure `onDrop` updates the `parentId` of the dragged folder to the target folder's ID.
2.  **Create Modal:** Add a `<Select>` input in `CreateFolderModal` to choose a "Parent Folder" (default: None/Root).
3.  **Validation:** Prevent a folder from being dropped into itself or its own children (Circular dependency check).

## 3. SIDEBAR FOLDER LOGIC (Pinned Only)
**Rule:** The Sidebar must ONLY show **Pinned** folders.
* **Free Plan:** Show max **3 Pinned Root Folders**.
* **Pro Plan:** Show **All Pinned Root Folders**.
* **Unpinned Folders:** Must NOT appear in the sidebar (only in `/dashboard/folders`).
* *Current Bug:* It might be showing unpinned folders or not respecting the limit correctly.

## 4. SIDEBAR TAG LOGIC (Best Practice)
**Rule:** Clean up the tag list.
* **Free Plan:** **Do NOT show any tags.** Show a single link: *"View all tags →"*.
* **Pro Plan:** Show **ONLY Pinned Tags** (Max 5).
* **UI:** Remove the clutter. If a Pro user has 20 tags but only 2 pinned, show only 2.

---

## IMPLEMENTATION DETAILS

### A. `useOrganization.ts` (Store)
Ensure these getters exist and are accurate:
* `getPinnedRootFolders()`: Returns `folders.filter(f => f.isPinned && !f.parentId)`.
* `getPinnedTags()`: Returns `tags.filter(t => t.isPinned)`.

### B. `Sidebar.tsx` (Component)
* **Folders Render:**
    ```tsx
    const pinnedRoots = getPinnedRootFolders(); // Must be strictly pinned & root
    const displayFolders = isPro ? pinnedRoots : pinnedRoots.slice(0, 3);
    ```
* **Tags Render:**
    ```tsx
    {!isPro ? (
       <Link href="...">View all tags →</Link>
    ) : (
       // Map pinnedTags.slice(0, 5)
    )}
    ```

### C. `CreateFolderModal.tsx`
Add a field `parentId`. When creating:
* `addFolder({ name, color, parentId: selectedParentId, isPinned: true })`
* *Note:* Auto-pin new folders so they appear in the sidebar immediately.