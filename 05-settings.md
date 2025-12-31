# atbookmark — Studio Settings & Preferences

**Reference:** `00-initial-plan.md` & `01-design-system.md`
**Role:** The control center for the user's "Second Brain".

---

## 1. PAGE LAYOUT (UPDATED)

* **URL:** `/dashboard/settings`
* **Layout Structure:**
    * **Mobile:** Single column stack.
    * **Desktop:** **2-Column Grid** (`grid-cols-1 lg:grid-cols-2`).
    * **Flow:**
        * **Top Row:** Profile Card (Left) | Account Card (Right).
        * **Middle:** Appearance | Saving Behavior.
        * **Bottom:** Full-width sections (Import/Export, Danger Zone).

---

## 2. DESIGN SYSTEM & UX RULES

### A. Section Card (The Container)
* **Style:** White bg, 2px border, hard shadow (`shadow-[4px_4px_0px_#000]`), `rounded-xl`.
* **Height:** `h-fit` (To accommodate masonry-like stacking).

---

## 3. SETTINGS SECTIONS

### A. Profile (Identity) — [Interactive]
* **Elements:**
    1.  **Avatar Upload:**
        * 80px circle image.
        * **Interaction:** Clicking the avatar OR the "Edit" pencil icon **MUST open the local file manager**.
        * *Mock Logic:* Display the selected image immediately using `URL.createObjectURL`.
    2.  **Display Name:** Input field.
    3.  **Bio:** Textarea.
* **Action:** "Update Profile" button.

### B. Account (Read Only)
* **Fields:** Email, User ID, Plan Badge.

### C. Appearance
* **Options:** Theme (Light/Cream/Dark Pro), Density.

### D. Saving Behavior
* **Toggles:** Auto-read, Save to Folder, etc.

### E. AI Assistant
* **Toggles:** Auto-tag, Summaries.

### F. Danger Zone (Full Width)
* **Style:** Red border, Light Red bg.

---

## 4. INTERACTION DETAILS
* **Navigation:** Ensure any "Edit Profile" link in the app (e.g., from Dropdown) redirects correctly to this page.
* **File Upload:** Use a hidden `input type="file"` ref.