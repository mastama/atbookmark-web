# atBookmark — Home Dashboard & Core Experience

**Goal:** Make Home the **Control Center**. It must be fast, actionable, and encouraging.
**Philosophy:** "Inbox is for processing. Library is for storing."

---

## 1. LAYOUT & HIERARCHY

### 1.1 Header Area (The Welcome)
- **Greeting:** "Good morning, [Name]." / "Ready to organize?"
- **Global Search Bar:** Prominent visual input (`Cmd+K` trigger).
- **Quick Capture:** A dedicated input: *"Paste link to save..."* (Enter to save to Inbox immediately).

### 1.2 Onboarding (Conditional - Only for New Users)
*Show if `totalBookmarks < 5`*
- **Checklist:**
  1. [ ] Install Browser Extension
  2. [ ] Create your first Folder
  3. [ ] Save 3 links
  4. [ ] Try `Cmd+K`
- *Reward:* "You're ready! Badge unlocked."

---

## 2. CORE WIDGETS

### 2.1 Smart Inbox (The Queue)
*Displays the top 5-10 items in Inbox.*
- **Zero State:** "Inbox Zero! 🎉 You are all caught up."
- **Action Mode:** Hover actions to quickly: `Check (Done/Archive)`, `Move`, `Delete`.
- **Pro Feature:** "Clean Up Suggestions" (e.g., "These 3 items are from youtube.com, move to 'Watch Later'?")

### 2.2 Recent & Continue (The Flow)
*Displays items accessed or saved recently.*
- **Card Design:** Visual focus (Cover image).
- **Progress Bar:** If article/video was partially consumed.
- **Limit:** 8 items (Horizontal scroll or Grid).

### 2.3 Statistics (Gamification)
- **Free:** Simple counters (Total Bookmarks, Total Folders).
- **Pro:** "Weekly Insight" chart (e.g., "You read 5 articles this week vs 2 last week").

---

## 3. MAIN LIST VIEW (The Library)

### 3.1 Tabs/Filters
- **All / Unread / Favorites**
- **View Toggle:** Grid (Visual) vs. Table (Data-dense).

### 3.2 Pagination & Loading
- **Pagination:** "Load More" button (Hybrid approach). Better than infinite scroll for footer access.
- **Default:** 12 items per load.

---

## 4. POWER FEATURES (Free vs Pro Logic)

### 4.1 View Modes
- **Grid View (Free/Pro):** Standard card with cover.
- **Table View (Pro):** Sortable columns (Date, Domain, Size, Tags). Useful for managing hundreds of links.

### 4.2 Bulk Operations
- **Selection:** Checkbox selection or Shift+Click.
- **Floating Toolbar:** When items selected, show bottom bar:
  - [Move to Folder]
  - [Add Tags]
  - [Mark as Read]
  - [Delete]

---

## 5. TECHNICAL SPECS

### 5.1 State Management
- **Store:** `useBookmarks` (Zustand).
- **Selectors:** `getRecentBookmarks()`, `getInboxBookmarks()`.
- **Persist:** LocalStorage for view preferences (`viewMode`, `sortBy`).

### 5.2 Performance
- **Image Optimization:** Use a generic blurred placeholder if cover image fails.
- **Debounce:** Search input (300ms).

### 5.3 Security
- **Sanitization:** All rendered URLs must be sanitized.
- **Preview:** Do not load iframes automatically (prevent tracking pixels).

---

## 6. SHORTCUTS (Keyboard First)
- `Cmd+K`: Open Command Palette.
- `Cmd+V` (on body): Detect URL paste -> Open Add Modal automatically.
- `/`: Focus Search bar.