# Logic Spec: Settings Appearance & Pro Locking

**Goal:** Make the Appearance tab functional but strictly enforce Pro limits to drive upgrades.

## 1. THEME LOGIC
* **Light Mode:** Always unlocked (Default).
* **Dark Mode:** **PRO ONLY**. (Locked visual + Trigger Pro Modal).
* **System Mode:** **PRO ONLY**. (Locked visual + Trigger Pro Modal).
* *Implementation:* Use `next-themes` or manual class switching on `<html>`.

## 2. CARD DENSITY LOGIC
* **Comfortable:** Always unlocked (Default). Large padding (`p-4`), normal gaps.
* **Compact:** **PRO ONLY**. Reduced padding (`p-2`), smaller fonts (`text-sm`), tighter gaps.
* *Implementation:* Update `useSettings` store to save this value. `BookmarkCard` must subscribe to this value to adjust its CSS classes.

## 3. CUSTOM APP ICON LOGIC
* **Default (Blue):** Always unlocked.
* **Custom (Mint, Coral, Lavender):** **PRO ONLY**.
* *Action:* Clicking a custom icon (if Pro) should dynamically change the browser tab favicon (`<link rel="icon">`).
* *Visual:* Locked icons should have opacity-50 and a small Lock badge.

## 4. INTERACTION RULES
* **If User is FREE:**
    * Clicking a locked option (Dark, Compact, Custom Icon) must **NOT** change the setting.
    * Instead, it must open the `ProModal`.
* **If User is PRO:**
    * Clicking applies the change immediately.