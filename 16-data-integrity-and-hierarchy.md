# Critical Fixes: Data Integrity & Visual Hierarchy

**Goal:** Ensure deleting tags cleans up references in bookmarks (preventing "zombie" data) and fix the Folder Dashboard to properly reflect structure (Root vs. Nested) and user intent (Manual Pin).

---

## 1. TAG DATA INTEGRITY (The "Zombie" Bug)

**Issue:**
When a user deletes a Tag, the `Tag` entity is removed, but Bookmarks referencing that `tagId` are NOT updated.
If a user creates a new tag (or views old data), the bookmarks still show the deleted tag or re-associate incorrectly.

**Fix: Cascading Delete**
* **Action:** Modify the `deleteTag` function in the Store.
* **Logic:**
    1.  Remove the Tag from `tags` array.
    2.  **CRITICAL:** Iterate through ALL Bookmarks. If a bookmark has the deleted `tagId` in its `tags` array, **remove that ID** from the array.
    3.  This ensures bookmarks are completely "clean" of the deleted tag.

---

## 2. FOLDER DASHBOARD HIERARCHY (`/dashboard/folders`)

**Issue A: Flat View**
The page currently renders `folders.map(...)` for ALL folders. This mixes Parent folders and Child folders in one messy grid.

**Fix: Root-Only View & Drill-down**
* **Filter:** The main `/dashboard/folders` page must **ONLY** render folders where `parentId === null` (Root Folders).
* **Navigation:** When a user clicks a Folder Card, it should navigate to `/dashboard/folders/[id]`.
* **Child View:** Inside the Folder Detail page (`[id]`), display a section "Sub-folders" at the top, followed by the bookmarks.

**Issue B: Drag & Drop in Grid**
* **Feature:** The Cards in the main grid must support Drag & Drop (Native HTML5) just like the Sidebar.
* **Logic:** Dragging "Folder A" onto "Folder B" should update `Folder A.parentId = Folder B.id`.

---

## 3. MANUAL PINNING (UX Fix)

**Issue:**
Currently, creating a folder automatically sets `isPinned: true`.

**Fix:**
* **Default State:** In `CreateFolderModal`, set the default state to `isPinned: false`.
* **UI:** Let the user explicitly choose to pin it later (via context menu or edit), OR add a "Pin to Sidebar" checkbox in the Create Modal.