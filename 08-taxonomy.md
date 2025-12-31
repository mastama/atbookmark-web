# atbookmark — Taxonomy Pages (Folders & Tags)

**Reference:** `07-organization.md`, `image_6786d0.jpg`
**Goal:** Create a clean system to **manage (CRUD)** and **browse (view)** bookmarks.

---

## 0. SCOPE & CONSTRAINTS
- Frontend only (Local State).
- **Optimistic UI:** Changes happen instantly.
- **Freemium Check:** Creating new folders/tags must respect the limits defined in `07-organization.md`.

---

## 1. ROUTE STRUCTURE

| Route | Type | Purpose |
| :--- | :--- | :--- |
| `/dashboard/folders` | Manager | Grid view to Create, Rename, Delete, Pin folders. |
| `/dashboard/tags` | Manager | Cloud view to Manage tags. |
| `/dashboard/folder/[id]` | View | **The Detail Page:** Shows bookmarks inside a specific folder. |
| `/dashboard/tag/[id]` | View | **The Detail Page:** Shows bookmarks with a specific tag. |

---

## 2. FOLDERS MANAGER (`/dashboard/folders`)

### Header
- **Title:** "My Collections"
- **Subtitle:** "Your mental shelves."
- **Action:** `+ New Folder` Button.
    * *Logic:* Triggers `CreateFolderModal`. **Must check Freemium Limit first.**

### Content States
1.  **Empty State (No custom folders):**
    * *Visual:* Large outlined folder icon.
    * *Text:* "No custom folders yet. Start organizing!"
2.  **Populated State:**
    * *Layout:* Responsive Grid.
    * *Sorting:* Pinned folders appear first, then Alphabetical.

### Component: `FolderCard`
* **Visual:** Neo-brutalism box, colored icon, count badge.
* **Actions (Hover Menu):**
    * ✏️ **Rename:** Open Edit Modal.
    * 🎨 **Change Color:** Open Color Picker.
    * 📌 **Pin/Unpin:** Toggles `isPinned` status.
    * 🗑️ **Delete:** Show confirmation. (Disabled for "Inbox").

---

## 3. TAGS MANAGER (`/dashboard/tags`)

### Header
- **Title:** "All Tags"
- **Subtitle:** "Keywords for your brain."

### Content
-   **Layout:** Flex-wrap "Tag Cloud".
-   **Component:** `TagCard` (Pill shape).
-   **Actions:** Hover to Rename/Delete.

---

## 4. DETAIL VIEWS (BROWSING MODE)
*These pages reuse the `BookmarkGrid` from the Dashboard but with specific filters.*

### A. Folder Detail (`/dashboard/folder/[id]`)
* **Header:**
    * **Title:** Folder Name (e.g., "Recipes").
    * **Subtitle:** "12 bookmarks".
    * **Actions:** Sort by (Date Added / Title).
* **Empty State (Folder exists but is empty):**
    * *Text:* "This folder is empty."
    * *CTA:* "Add Bookmark Here" (Opens Add Modal with this folder pre-selected).
* **Filter Logic:** `bookmarks.filter(b => b.folderId === params.id)`

### B. Tag Detail (`/dashboard/tag/[id]`)
* **Header:** Tag Name (e.g., "#React").
* **Filter Logic:** `bookmarks.filter(b => b.tags.includes(params.id))`

---

## 5. STORE UPDATES (`useOrganizationStore`)
To support these pages, update the store:
1.  **Pinning:** Add `togglePin(folderId)` action.
2.  **Sorting:** `folders` array should be sorted: Pinned First > System (Inbox) > Others.
3.  **Validation:** Ensure `deleteFolder` moves bookmarks to "Inbox" (Trash logic is optional for now).