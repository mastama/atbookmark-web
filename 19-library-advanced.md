# Feature Spec: All Library & Advanced Filtering

**Goal:** Provide a comprehensive view of all bookmarks with granular filtering, sorting, and bulk management capabilities.

---

## 1. FILTERING SYSTEM (The Brain)
Filters must be additive (AND logic).

### 1.1 Date Filter
* **Options:**
  - All Time (Default)
  - Today
  - Last 7 Days
  - This Month
  - This Year
  - Custom Range (Start Date - End Date)
* **Logic:** Use `date-fns` for comparison against `createdAt`.

### 1.2 Attribute Filters
* **Folder:** Dropdown list of folders.
* **Tags:** Dropdown/Multi-select tags.
* **Domain:** Text input (fuzzy search) or Dropdown of top domains.
* **Status:**
  - All
  - Unread (Default focus)
  - Read
  - Favorites

---

## 2. VIEW MODES

### 2.1 Grid View (Visual)
* Reuses `BookmarkCard` component.
* Good for visual browsing.

### 2.2 Table View (Data Dense)
* **Columns:**
  - Checkbox (Select)
  - Title & URL (Combined)
  - Tags (Pills)
  - Folder (Badge)
  - Date Added
  - Actions (Edit/Delete)
* **Features:** Compact rows, easier for bulk selection.

### 2.3 Pagination
* **Items per page:** 12, 24, 48 (User selectable).
* **Controls:** [Prev] [1] [2] ... [10] [Next].
* **Position:** Fixed at the bottom or scrollable footer.

---

## 3. BULK & MAINTENANCE ACTIONS

### 3.1 Selection-Based Actions (When items selected)
* **Bar:** Floating bottom bar or Top Toolbar.
* **Actions:**
  - Mark as Read / Unread
  - Toggle Favorite
  - Move to Folder
  - Delete Selected

### 3.2 Global Maintenance (No selection needed)
* **"Cleanup" Button (Dropdown):**
  - *Delete All Read Items* (Requires confirmation dialog).
  - *Delete All Unread Items* (Requires strict confirmation).
  - *Mark All as Read* (Current filter view).

---

## 4. TECHNICAL IMPLEMENTATION
* **State:** Use local state or a custom hook `useLibraryFilters` to manage all filter variables.
* **Performance:** Filter logic must be optimized (do not loop through 10,000 items on every render). Use `useMemo`.