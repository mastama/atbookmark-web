# atbookmark — Data Persistence & Pro Debugging

**Reference:** `07-organization.md`, `09-final-refinements.md`
**Goal:** Ensure bookmarks are actually saved to the store and provide a way to test Pro features.

---

## 1. FIXING THE "SAVE BOOKMARK" LOGIC
**Issue:** Bookmarks are not appearing after saving.
**Root Cause:** The `AddBookmarkModal` likely handles form state but doesn't dispatch an `addBookmark()` action to a global store.

### A. The `useBookmarksStore`
We need a dedicated store for bookmarks (separate from organization, or combined).
* **State:** `bookmarks: Bookmark[]`
* **Action:** `addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>)`
* **Logic:**
    1.  Generate a unique ID (uuid).
    2.  Set `createdAt` to `new Date()`.
    3.  Prepend to the `bookmarks` array (Newest first).
    4.  **Auto-Assign Inbox:** If `folderId` is missing/null, force it to `'inbox'`.

### B. Update `AddBookmarkModal`
* **On Save:**
    1.  Collect Form Data: `url`, `title`, `folderId`, `tags`.
    2.  Call `addBookmark(data)`.
    3.  Show Success Toast.
    4.  Reset Form & Close Modal.
    5.  **Crucial:** Navigate user to the selected folder (or stay on current page and refresh).

---

## 2. THE "DEV TOOLS" (PRO TOGGLE)
Since we have no backend, we need a UI control to switch between Free and Pro plans for testing.

### A. The "Debug Toggle"
* **Location:** Bottom of the **Sidebar** (Hidden or small).
* **Visual:** A small text/button: `[Dev: Toggle Pro]`.
* **Logic:**
    * Clicking it toggles the `isPro` boolean in `useOrganizationStore`.
    * Show a toast: "Switched to [Pro/Free] Plan".

### B. Sidebar Updates
* **Visual Indicator:**
    * If `isPro === true`: Show a gold "PRO" badge next to the user avatar or name.
    * If `isPro === false`: Show a "Upgrade" button in the sidebar footer.

---

## 3. DATA PERSISTENCE (LOCAL STORAGE)
To ensure data survives a page refresh (F5), we must use `persist` middleware from Zustand.

* **Store Config:**
    * Wrap `useOrganizationStore` with `persist`.
    * Wrap `useBookmarksStore` with `persist`.
    * **Key:** `'atbookmark-storage'`.

---

## 4. DASHBOARD REFRESH
* **Effect:** The Dashboard and Folder Detail pages must listen to the store. When a new bookmark is added, the grid should immediately re-render to show the new card.