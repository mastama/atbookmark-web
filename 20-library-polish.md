# Feature Spec: Library UI Final Polish

**Goal:** Deliver a fast, scalable, and safe Library experience with advanced filtering, bulk actions, and clear table readability.

---

## 1. PAGE LAYOUT (`/dashboard/library`)

**Top Controls (Toolbar):**
1.  **Search Bar:** Global text search.
2.  **Quick Chips:** Inline toggle buttons `[ Unread ]` `[ Favorite ]`.
3.  **Filter Button:** Opens a Popover for detailed filtering.
4.  **View Switcher:** Toggle between Grid/Table.
5.  **Cleanup/Action Button:** Dropdown for bulk operations.

---

## 2. FILTER LOGIC (Client-Side Optimization)

**State Interface:**
```typescript
interface LibraryFilterState {
  datePreset: "all" | "today" | "7d" | "30d" | "month" | "custom";
  dateRange: { from?: Date; to?: Date }; // Using date-fns range
  folderId: string | "all";
  tagId: string | "all";
  domain: string | "all";
  status: "all" | "unread" | "read" | "favorite";
}