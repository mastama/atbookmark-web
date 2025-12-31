# Refactor: Sidebar Architecture & Data Sync

**Goal:** Fix data synchronization issues, implement nested folders with drag-and-drop, and clean up the sidebar UI using a "Pinned" logic (Free vs Pro).

---

## 1. DATA STORE UPDATES (Single Source of Truth)

### A. `useOrganizationStore.ts`
We need to support nesting and pinning.
* **Update Interface `Folder`:**
    * `parentId: string | null` (For nesting).
    * `isPinned: boolean` (For sidebar visibility).
    * `index: number` (For sorting/ordering).
* **Update Interface `Tag`:**
    * `isPinned: boolean` (For sidebar visibility).

### B. `useBookmarksStore.ts` (Fixing the Count Mismatch)
**The Problem:** Sidebar and Page calculate counts differently.
**The Fix:** Move the calculation logic *inside* the store as a selector.
* **Action:** Create a centralized selector `getFolderCount(folderId: string)`.
* **Logic:** `items.filter(i => i.folderId === folderId && !i.isTrashed).length`.
* **Usage:** Both `<Sidebar />` and `<FolderPage />` must call this exact function.

---

## 2. SIDEBAR LOGIC (Pinned & Nested)

### A. Folders: Recursive & Drag-n-Drop
Instead of a flat list, render a **Recursive Tree**.
* **Component:** Create `<FolderItem />` that can render itself if it has children.
* **Drag & Drop:** Implement **Native HTML5 Drag & Drop**.
    * Allow dragging a folder *into* another folder.
    * Action: Update `parentId` of the dragged folder.
* **Visibility Logic (Crucial):**
    * **Filter:** Show ONLY folders where `isPinned === true` AND `parentId === null` (Root pinned folders). Sub-folders are shown when expanded.
    * **Free Plan Limit:** If `!isPro`, `slice(0, 3)`. Show max 3 pinned root folders.
    * **Pro Plan:** Show all pinned root folders.
    * **Unpinned Folders:** Do not show in Sidebar. They live in "All Library".

### B. Tags: Clean Interface
* **Free Plan:** Hide the list. Show a single link: *"View all tags →"* (redirects to `/dashboard/tags`).
* **Pro Plan:** Show ONLY tags where `isPinned === true`.
* **Limit:** Max 5 pinned tags in the sidebar to prevent clutter.

### C. Visual Polish
* **Counts:** Remove colored badges. Use subtle text (e.g., `text-neutral-400 text-[10px]`) aligned right.
* **Active State:** Use a light background `bg-primary/10` and `text-primary`.

---

## 3. MODALS UPDATE

### A. Create/Edit Folder Modal
* **Parent Selection:** Add a dropdown "Location" to select a `parentId` (making it a sub-folder). Default to "Root".
* **Color Picker (Pro Feature):**
    * **Condition:** If `!isPro`, show 5 pastel radio buttons.
    * **Condition:** If `isPro`, show a full 4x5 Grid of Tailwind colors (500/400 shades).
    * **UI:** Selected color must have a clear ring border.

### B. "Pinning" UI (Context Menu or Edit)
* Ensure users have a way to toggle `isPinned` (e.g., in the Edit Modal or a context menu on the Folders page), otherwise nothing will appear in the sidebar.