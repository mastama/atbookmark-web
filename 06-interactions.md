# atbookmark — Interactions & Navigation Flow

**Reference:** `04-dashboard.md`, `05-settings.md`
**Goal:** Fix broken links, implement "Add" functionality, and manage Landing/Dashboard bridging.

---

## 1. GLOBAL NAVIGATION RULES

### A. Logo Behavior
* **Component:** `Sidebar` (Dashboard) and `Navbar` (Landing).
* **Logic:**
    * Clicking the "atbookmark 🔖" logo MUST always redirect to the **Landing Page** (`/`).
    * *Current Issue:* It redirects to `/dashboard`. This needs to be changed to `/`.

### B. Landing Page Navbar (Smart Auth)
* **Component:** `LandingNavbar.tsx` (or inside `page.tsx`).
* **Logic:** Check authentication state (Mock).
    * **If User is Guest:** Show "Login" and "Get Started" buttons.
    * **If User is Logged In:**
        * Hide "Login".
        * Show a **"Go to Dashboard 🚀"** button (Indigo, Hard Shadow).
        * Show User Avatar (optional).

---

## 2. HEADER ACTIONS (DASHBOARD)

### A. "Add New" Button
* **Location:** Top Header (Dashboard).
* **Action:** Clicking this opens the **Add Bookmark Modal**.
* **Modal Content:**
    * **Title:** "Save a new gem."
    * **Input:** URL (Auto-focus).
    * **Input:** Title (Optional).
    * **Dropdown:** Select Folder.
    * **Button:** "Save Bookmark" (Simulates saving -> Toast success -> Closes modal).

### B. User Dropdown Menu
* **Location:** Top Right Avatar.
* **Items & Links:**
    1.  **Edit Profile:**
        * **Action:** Link to `/dashboard/settings`.
        * *Fix:* Currently non-functional.
    2.  **Billing (Pro):**
        * **Badge:** Yellow "PRO" pill.
        * **Action:** Opens the **Pro Upsell Modal**.
        * **Modal Content:** "Upgrade to Pro to unlock unlimited storage and AI." (Mock).
    3.  **Logout:**
        * **Action:** Clears session -> Redirects to `/login`.

---

## 3. PRO UPSELL MODAL
* **Trigger:** Clicking "Billing", "Dark Mode" (Settings), or other locked features.
* **Design:**
    * **Header:** "Unlock the Full Brain 🧠"
    * **Body:** List of benefits (Dark Mode, Unlimited AI, Priority Support).
    * **CTA:** "Upgrade for $4/mo" (Button).
    * **Secondary:** "Maybe Later" (Close).

---

## 4. TECHNICAL IMPLEMENTATION
* **State Management:** Use a simple `useState` for Modals (`isAddModalOpen`, `isProModalOpen`).
* **Routing:** Use `Link` from `next/link` for internal navigation.