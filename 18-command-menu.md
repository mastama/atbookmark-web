# Feature Spec: Command Menu (Global Search)

**Goal:** A keyboard-first "Control Center" (`Cmd+K`) to navigate, search, and perform actions instantly.

---

## 1. COMPONENT ARCHITECTURE
**File:** `components/dashboard/CommandMenu.tsx`
**Library:** `cmdk` (via shadcn/ui `Command` components).

## 2. TRIGGERS
1.  **Keyboard Shortcut:** `Cmd+K` (Mac) or `Ctrl+K` (Windows).
2.  **Event Listener:** Must listen for a custom window event `"openCommandMenu"` (triggered by the fake search bar in Header).

## 3. SEARCH GROUPS & LOGIC

The menu should be organized into these groups:

### A. Quick Actions (Top Priority)
* "Add New Bookmark" (Opens Add Modal)
* "Create New Folder" (Opens Folder Modal)
* "Go to Inbox" (`/dashboard/folder/inbox`)

### B. Navigation (General)
* "Home" (`/dashboard`)
* "Favorites" (`/dashboard/favorites`)
* "All Library" (`/dashboard/library`)
* "Settings" (`/dashboard/settings`)

### C. Folders (Dynamic)
* **Source:** `useOrganization` store.
* **Action:** Navigate to `/dashboard/folder/[id]`.
* **Icon:** Folder Icon.

### D. Recent Bookmarks (Dynamic)
* **Source:** `useBookmarks` store (slice top 5 items).
* **Action:** Open URL in new tab.
* **Footer Item (Crucial):**
    * Label: *"View all bookmarks..."*
    * Action: Navigate to `/dashboard/library`.
    * *Context:* If the user can't find the bookmark here, they should go to the main library.

### E. Tags (Dynamic)
* **Source:** `useOrganization` store.
* **Action:** Navigate to `/dashboard/tag/[id]`.

## 4. UX DETAILS
* **Z-Index:** Must be high (`z-50`) to sit above all modals.
* **Responsive:** Full screen on mobile, centered dialog on desktop.
* **Icons:** Use `lucide-react` for visual cues (e.g., `Plus`, `LayoutGrid`, `Folder`, `Hash`).