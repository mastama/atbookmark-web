# atbookmark — Organization, Limits & Taxonomy

**Reference:** `04-dashboard.md`, `06-interactions.md`
**Goal:** Empower users to structure their knowledge, while gently pushing them to upgrade.

---

## 1. THE "INBOX" SYSTEM (CORE FEATURE)
Unlike competitors, we enforce an "Inbox Zero" workflow.
* **System Folder:** Created automatically. Cannot be deleted or renamed.
* **Behavior:** If a user saves a link without choosing a folder, it goes to **Inbox**.
* **Visual:** Distinct Icon (e.g., `Inbox` from Lucide), pinned at the top of the Sidebar.

---

## 2. FREEMIUM LIMITS (LOGIC)
We use limits to encourage Pro upgrades.

| Feature | Free Plan | Pro Plan |
| :--- | :--- | :--- |
| **Folders** | Max **3** Custom Folders | Unlimited |
| **Tags** | Max **3** Custom Tags | Unlimited |
| **Colors** | Random Assignment | Custom Selection |

* **Trigger:** If a Free user clicks (+) to add the 4th Folder/Tag...
* **Action:** Block creation -> Open **Pro Upsell Modal**.
* **Copy:** "Whoops! Your shelf is full. Unlock unlimited storage for just $4."

---

## 3. SIDEBAR UPGRADE (DYNAMIC LISTS)

### A. The "FOLDERS" Section
1.  **Inbox** (Fixed at top).
2.  **Custom Folders** (List).
    * *Design:* Folder Icon (colored) + Name + Count Badge.
3.  **Action:** (+) Button.
    * *Logic:* Checks limit before opening modal.

### B. The "TAGS" Section
1.  **Custom Tags** (List).
    * *Design:* Pill shape (`rounded-full`), pastel background, small text.
2.  **Action:** (+) Button.

---

## 4. ADD BOOKMARK MODAL (UPGRADE)
**Current Issue:** Missing Tag Input.
**Fix:** Add a Multi-select Tag Input field.

### Field Specs:
* **Label:** "Tags (Optional)"
* **Input Behavior:**
    * User types text (e.g., "Design").
    * Press **Enter** or **Comma (,)** -> Text turns into a **Pill/Chip**.
    * **Backspace** deletes the last pill.
    * *Limit Check:* If user tries to add >3 tags *inline* (and is Free), show a small red warning text below input.

---

## 5. CREATE MODALS (NEW)

### A. Create Folder Modal
* **Input:** Name (e.g., "Inspiration").
* **Color Picker (Radio):** 5 Pastel Colors. (Locked/Random for Free users).

### B. Create Tag Modal
* **Input:** Tag Name.

---

## 6. DATA STORE (`useOrganizationStore`)
* **State:**
    * `folders`: `[{ id: 'inbox', name: 'Inbox', type: 'system', color: 'gray' }, ...]`
    * `tags`: `[]`
    * `isPro`: `boolean` (Default: `false`).
* **Actions:**
    * `addFolder(name, color)` -> Check limit.
    * `addTag(name)` -> Check limit.