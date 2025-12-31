# Feature Spec: Bulk Actions & Tag Enhancements

**Goal:** Implement efficient multi-item management (Bulk Actions) and fix the missing "Pin" functionality on the Tags page.

---

## 1. TAG PAGE ENHANCEMENTS (`/dashboard/tags`)

### A. Pinning UI
**Current Issue:** Users cannot pin tags from the UI shown in `image_760fc3.jpg`.
**Requirement:**
* Update `TagCard.tsx`.
* Add a **Pin Icon Button** (Push pin icon) to the top-right corner of the card.
    * **State:** If `isPinned === true`, fill the icon (solid). If `false`, outline only.
    * **Action:** Clicking toggles the `isPinned` status in the store.
* **Sorting:** Ensure the `tags` list in `useOrganization` automatically sorts **Pinned tags first**, then alphabetical.

### B. Visual Tweaks
* Show a small "count" badge inside the card indicating how many bookmarks use this tag (e.g., "12 items").

---

## 2. BULK ACTIONS SYSTEM (Multi-Select)

### A. UX Flow
1.  **Selection Mode:**
    * Hovering over a bookmark row/card reveals a **Checkbox**.
    * Clicking the checkbox adds the ID to a `selectedIds` state array.
    * **"Select All"**: A master checkbox in the table header/top bar.
    * **Shift + Click:** Allow range selection (nice to have).
2.  **Floating Toolbar:**
    * When `selectedIds.length > 0`, a **Floating Toolbar** appears fixed at the bottom center of the screen.
    * **Visual:** Dark styling (black/gray), rounded pills, distinct from the white background.
    * **Text:** "X selected".

### B. Supported Actions (Toolbar Buttons)
1.  **Move to Folder:** Opens a small dropdown/dialog to pick a destination folder.
2.  **Add Tag:** Opens a simplified tag picker.
3.  **Delete/Trash:** Moves items to trash (with confirmation).
4.  **Cancel (X):** Clears selection.

### C. Implementation Scope
This logic must apply to:
* **Inbox Page** (List of bookmarks)
* **Folder Detail Page** (List of bookmarks)
* **Tags Page** (Bulk deleting tags - optional, focus on bookmarks first)

---

## 3. TECHNICAL IMPLEMENTATION

### State Management (Hook Suggestion)
Create a reusable hook `useBulkSelection` to avoid code duplication across pages.
```typescript
const { 
  selectedIds, 
  toggleSelection, 
  selectAll, 
  clearSelection, 
  isSelectionMode 
} = useBulkSelection(items);