# Feature Spec: Browser Extension Page

**Goal:** Drive adoption of the browser extension to increase user retention and data capture speed.

---

## 1. PAGE LAYOUT (`/dashboard/extension`)

### 1.1 Hero Section
* **Headline:** "Save to atBookmark in One Click."
* **Subhead:** "Stop switching tabs. The extension captures URL, content, and metadata instantly."
* **Primary Action:** [Download for Chrome] (Button with Chrome Icon).
* **Secondary Action:** [View Source / Github] (Trust signal).

### 1.2 Connection Card (The "Power" Feature)
* **Context:** The extension needs to know *who* you are.
* **UI:** An "API Key" box.
    * **Display:** Masked by default (`at_live_pk_****************`).
    * **Actions:** [Copy to Clipboard], [Regenerate Key].
    * **Note:** "Paste this key into the extension settings."

### 1.3 Feature Highlights (Grid)
1.  **One-Click Save:** Instantly save current tab.
2.  **Context Menu:** Right-click on any link -> "Save to atBookmark".
3.  **Side Panel:** Access your library without leaving the current page.

### 1.4 Installation Steps (Stepper)
1.  Add to Chrome.
2.  Pin the extension icon.
3.  Login or Paste API Key.

### 1.5 Shortcuts (Efficiency)
* `Alt + B` : Save current tab.
* `Alt + S` : Open Sidebar search.

---

## 2. SIDEBAR UPDATE
* **Label:** "Extension"
* **Icon:** `Puzzle` (Lucide React).
* **Location:** Under "My Brain" or a new group "Tools".

---

## 3. TECHNICAL MOCKS
Since we don't have a real backend yet, the API Key should be a static mock string or generated client-side for demo purposes.