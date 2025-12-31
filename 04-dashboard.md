# atbookmark — Dashboard & Core App Layout

**Reference:** `00-initial-plan.md` & `01-design-system.md`
**Inspiration:** Simpan Dulu (Structure) + Pinterest (Visuals) + Duolingo (Gamification).

---

## 1. ACCESS CONTROL (Protected Routes)
* **Logic:** The Dashboard is a **Protected Route**.
* **Mock Implementation:** Check for a mock session flag in `localStorage` or Context.
    * If `isAuthenticated === false` → Redirect to `/login`.
    * If `isAuthenticated === true` → Render Dashboard.

---

## 2. APP SHELL LAYOUT
The app uses a classic "Sidebar + Header + Main Content" layout but styled with Neo-Brutalism.

### A. Sidebar (Left, Fixed)
* **Background:** White (`#FFFFFF`) with a right border (`2px solid #1F2937`).
* **Width:** 260px (Collapsible to icon-only on mobile).
* **Navigation Groups:**
    1.  **"My Brain" (Core):**
        * 🏠 Home / Overview
        * 📥 Inbox (Unsorted)
        * ❤️ Favorites
        * 📚 All Library
    2.  **"Smart Views" (AI Features - Unique Selling Point):**
        * ✨ AI Curated (Auto-grouped)
        * 🧠 Knowledge Graph (Visual tags)
        * 📉 RAM Saver (Suspended tabs)
    3.  **"Organization":**
        * 📂 Folders (Accordion)
        * 🏷️ Tags (Accordion)
* **Footer:** "Trash" and "Settings".

### B. Top Header (Sticky)
* **Background:** Cream (`#FDFBF7`) / Transparent (blends with page).
* **Left:** Breadcrumbs (e.g., "Home > Inbox").
* **Center:** **Command Bar** (Search input).
    * *Style:* Thick border, "Search your second brain... (Cmd+K)".
* **Right:**
    * **"Add New" Button:** Indigo, Hard Shadow.
    * **Notification Bell:** With a red dot.
    * **Profile Dropdown:** Avatar image.

---

## 3. DASHBOARD HOME (Content Area)
Unlike the *Simpan Dulu* reference which uses simple lists, *atbookmark* uses a **Bento Grid** header and **Masonry** content to look modern and playful.

### A. "Morning Briefing" (Stats Row)
Display 4 cards in a grid:
1.  **Total Stashed:** Simple counter (e.g., "1,240 Links").
2.  **Reading Streak:** 🔥 "5 Days" (Gamification element).
3.  **AI Insight:** "You're reading a lot about **#React** this week." (Dynamic Text).
4.  **Memory Saved:** "1.2 GB RAM freed" (referencing the landing page promise).

### B. "Quick Actions"
A horizontal strip of chips:
* [+ Paste from Clipboard]
* [✨ Tidy Up Inbox (3)]
* [📖 Continue Reading: "The Future of AI..."]

### C. Recent Bookmarks (The Grid)
* **Layout:** Masonry Grid (Pinterest style).
* **Card Design (Neo-Brutalism):**
    * **Image:** Large cover image (top half).
    * **Meta:** Domain icon + Site Name.
    * **Title:** Bold, truncated to 2 lines.
    * **Tags:** Colorful pills.
    * **Action:** Hover shows "Archive" and "Edit" buttons.

---

## 4. EMPTY STATES
If the dashboard is empty (new user):
* **Visual:** A large illustration of a relaxed person reading.
* **Text:** "Your library is empty. Let's feed your brain!"
* **CTA:** "Import from Chrome" or "Add first link".

---

## 5. INTERACTION DETAILS
* **Sidebar Toggle:** On Mobile, sidebar slides in from left (Sheet).
* **Profile Menu:** Clicking avatar opens a dropdown:
    * Edit Profile
    * Billing (Pro)
    * **Logout** (Redirects to Login).
* **Hover Effects:** Sidebar items get a pastel background (Mint/Lavender) on hover.