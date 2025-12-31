# atbookmark — Final Navigation & Logic Polish

**Reference:** `08-taxonomy-pages.md`, `07-organization.md`
**Goal:** Streamline navigation (remove friction) and implement Smart Tagging.

---

## 1. INBOX NAVIGATION FIX
* **Issue:** Clicking "Inbox" leads to 404.
* **Fix:**
    * The Inbox Item in Sidebar must link to `/dashboard/folder/inbox`.
    * The Folder Detail Page (`/dashboard/folder/[id]`) must handle the ID `inbox`.
    * *Logic:* If `params.id === 'inbox'`, fetch the system folder "Inbox" from the store.

---

## 2. SIDEBAR UX OVERHAUL (NO DROPDOWNS)
Remove the "Accordion/Collapsible" behavior. It slows down navigation.

### A. The "FOLDERS" Section
* **Header:**
    * Text: "FOLDERS" (Link to `/dashboard/folders`).
    * **Behavior:** Hover shows style change. Click navigates to Manager.
    * **Right Side:** Keep the (+) button for quick creation.
* **List Content:**
    * Render the specific custom folders directly below the header.
    * **Always Visible** (No toggle).
    * Item Click: Navigates to `/dashboard/folder/[folderId]`.

### B. The "TAGS" Section
* **Header:**
    * Text: "TAGS" (Link to `/dashboard/tags`).
* **List Content:**
    * Render the top 5 tags directly below.
    * Item Click: Navigates to `/dashboard/tag/[tagId]`.

---

## 3. SMART TAGGING LOGIC (ADD BOOKMARK MODAL)
**Scenario:** User types a tag "NewTopic" that doesn't exist yet.

### Current Behavior
Undefined / Confusing.

### Desired Behavior (Auto-Create)
1.  User types "NewTopic" and hits **Enter** (or Comma).
2.  **System Check:** Does "NewTopic" exist?
    * **Yes:** Select existing tag.
    * **No:** Check Freemium Limit (Max 3 tags for Free).
3.  **Action:**
    * **If Limit OK:** Automatically create "NewTopic", assign a random color, and select it as a chip. Show small toast: "Tag created ✨".
    * **If Limit Reached:** Block creation. Show red error text: "Tag limit reached. Upgrade to Pro."

---

## 4. EDGE CASES
* **Inbox Route:** Ensure the `useOrganization` store initializes the "Inbox" folder with ID `inbox` explicitly so the router matches it.
* **Empty Tag Input:** Pressing Backspace on empty input should delete the last selected tag chip.