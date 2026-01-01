# Feature Spec: Archives (The Cold Storage)

**Goal:** A dedicated space for inactive bookmarks that users don't want to delete but don't need daily.

---

## 1. DATA LOGIC
* **Filter:** `bookmark.archived === true`.
* **Exclusion:** These items must **NOT** appear in the Main Library, Home, or Search (unless specifically toggled).
* **Store Action:** `restoreBookmark(id)` sets `archived: false`.

## 2. UI/UX FEATURES

### 2.1 The "Dusty" Look
* **Visual:** Archived items should look "inactive".
* **Implementation:** Apply `grayscale` filter to cover images. Text color should be `text-muted-foreground`.

### 2.2 Header & Controls
* **Search Archives:** A dedicated search bar *just* for archives.
* **Bulk Actions:**
    * **Restore:** Moves items back to their original folder.
    * **Delete Forever:** Permanently removes from database (Danger).

### 2.3 Pro Feature: Auto-Archive (Mockup)
* A banner or settings card showing:
    * "🧹 Auto-Archive Rules active"
    * "Moving items older than 90 days to archive."

---

## 3. PAGE STRUCTURE (`/dashboard/archives/page.tsx`)

### Layout
1.  **Header:** Title "Archives" + Icon (Box/Archive).
2.  **Info Banner:** "Items here are hidden from your main library."
3.  **Toolbar:** Search Input + Bulk Action Menu.
4.  **Content:**
    * **Grid View:** Reusing `BookmarkCard` but passing a prop `isArchived={true}` to trigger the grayscale style.
    * **Empty State:** "Clean slate! No archived items found."