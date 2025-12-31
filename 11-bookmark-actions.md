# atbookmark — Bookmark Actions & Data Sync

**Reference:** `image_68f74f.jpg` (Card Actions), `image_68120b.png` (Counts)
**Goal:** Make the bookmark cards fully interactive and sync sidebar counts with real data.

---

## 1. DYNAMIC SIDEBAR COUNTS
**Issue:** Sidebar counts (Inbox: 3, Folders: 12) are static/mocked.
**Fix:** Connect `Sidebar.tsx` to `useBookmarksStore`.

### Logic
* **Inbox Count:** `bookmarks.filter(b => b.folderId === 'inbox').length`.
* **Folder Count:** `bookmarks.filter(b => b.folderId === folder.id).length`.
* **Total/All Library:** `bookmarks.length`.
* **Reactivity:** When a bookmark is added/deleted, these numbers MUST update automatically (Zustand handles this if selected correctly).

---

## 2. BOOKMARK CARD INTERACTIVITY
**Issue:** Clicking the card does nothing. Icons are dead.
**Reference Image:** Shows 3 icons overlay (Heart, Box/Trash, External Link).

### A. Main Card Click
* **Action:** Clicking the card body (outside buttons) opens the `url` in a new tab.
* **Code:** `window.open(bookmark.url, '_blank')`.

### B. Hover Action Buttons (Updated for CRUD)
To enable full CRUD, we need to adjust the buttons or add a menu.
**Recommended Layout (Hover Overlay):**
1.  **❤️ Favorite:** Toggles `isFavorite`. Visual: Turns red when active.
2.  **✏️ Edit (New):** Opens `EditBookmarkModal`.
3.  **🗑️ Delete:** Shows a "Confirm Delete" toast/dialog.

*(The "Open Link" button is redundant if the whole card is clickable, so we replace it with Edit or Delete for better utility).*

---

## 3. EDIT BOOKMARK MODAL (UPDATE CRUD)
**Trigger:** Clicking the Pencil icon on a bookmark card.
**Content:** Same as "Add Modal" but pre-filled.
* **Fields:** Title, URL, Folder, Tags.
* **Action:** "Save Changes". Calls `updateBookmark(id, data)`.

---

## 4. READER MODE (THE "READ" ACTION)
**Requirement:** User wants to "read contents".
**Route:** `/dashboard/read/[bookmarkId]`
**Implementation (MVP):**
* If your app parses content: Navigate to this internal route.
* If your app is a link manager: Just `window.open` is sufficient for now.
* *For this step, let's prioritize opening the link externally first.*

---

## 5. STORE UPDATES (`useBookmarksStore`)
We need robust actions to handle these interactions.

* `toggleFavorite(id)`
* `deleteBookmark(id)`
* `updateBookmark(id, { title, url, tags, folderId })`
* `getBookmarkCount(folderId)` (Helper selector)