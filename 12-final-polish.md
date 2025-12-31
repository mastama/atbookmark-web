# atbookmark — Final UI Polish & Advanced Organization

**Reference:** `image_73df93.png` (Color Picker), `Sidebar Feedback`
**Goal:** Make the UI cleaner (less noise), scalable (nested folders), and smarter (limited lists).

---

## 1. SIDEBAR VISUAL OVERHAUL

### A. Subtle Counts (Not Badges)
**Issue:** The "Notification Badge" style (Blue circle with white text) is too aggressive.
**Fix:** Change to a **Subtle Text Counter**.
* **Visual:** Just a number on the right side.
* **Style:** `text-xs text-neutral-400 font-medium`. No background color.
* **Hover:** When hovering the item, the text color can darken slightly.

### B. List Efficiency (Show More/Less)
**Issue:** Too many tags/folders clutter the sidebar.
**Fix:** Limit the initial render.
* **Logic:**
    * Show top 5 items.
    * If `items.length > 5`, show a button: `View all (12) ↓`.
    * Clicking expands the list.

---

## 2. ADVANCED FOLDERS (NESTED)
**Feature:** Allow creating folders inside folders.

### A. Data Structure (`useOrganizationStore`)
* Update `Folder` type: add `parentId: string | null`.
* **Root Folders:** `parentId === null`.
* **Sub-folders:** `parentId === 'folder-uuid'`.

### B. Sidebar Rendering
* **Indentation:** Sub-folders should be indented (`pl-4` or similar).
* **Tree View:** Render recursively.
    * 📂 Work
        * 📂 Project A
        * 📂 Project B

### C. Create Folder Modal (Updated)
* **New Field:** "Parent Folder" (Optional).
* **Dropdown:** List existing folders to choose as parent.

---

## 3. PRO COLOR PICKER
**Reference:** `image_73df93.png`
**Goal:** Give Pro users a full palette.

### A. The Picker Component
* **Free User:** Shows 5 basic pastel circles (Radio group).
* **Pro User:** Shows a **Grid of 25+ colors** (Tailwind palette: 500/400 shades) OR a Hex Input.
* **Visual:**
    * Use a Popover or Expandable section in the Modal.
    * Selected color shows a checkmark or ring.

---

## 4. DATA SYNC FIX (SIDEBAR VS PAGE)
**Issue:** Count on Sidebar != Count on "My Collections".
**Root Cause:** Sidebar might be counting *all* items, while Page counts only *root* items or vice versa.
**Fix:**
* Ensure both components rely on the SAME selector from `useOrganizationStore`.
* **Force Re-render:** Ensure `useBookmarksStore` triggers an update to `useOrganizationStore` counts whenever a bookmark is added/deleted.