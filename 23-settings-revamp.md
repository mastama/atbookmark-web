# Feature Spec: Settings Page Overhaul (Final – Production Ready)

**Product:** atBookmark
**Vision:** Your calm, powerful second brain
**Goal:** A centralized Settings experience that drives Pro upgrades while keeping Free users productive.

---

## 0. PLAN DEFINITION (GLOBAL LIMITS)

### Free Plan
- **Bookmarks:** Max 100 items.
- **Folders:** Max 5 custom folders.
- **Tags:** Max 3 custom tags.
- **Appearance:** Basic (Light/Dark only).
- **Intelligence:** Disabled.

### Pro Plan
- **Everything Unlimited.**
- **Full Customization:** Density, Fonts, Accent Colors.
- **AI Intelligence:** Auto-tagging, Auto-archive.

---

## 1. STATE MANAGEMENT

**Store:** `useSettings` (Zustand + Persist)

### 1.1 State Interface
```ts
interface SettingsState {
  // Appearance
  theme: 'light' | 'dark' | 'system';
  density: 'comfortable' | 'compact';
  
  // Intelligence (Pro)
  autoTagging: boolean;
  autoArchiveDays: number | null; // null = disabled

  // Profile (Pro)
  publicProfile: boolean;
  
  // Actions
  updateSettings: (settings: Partial<SettingsState>) => void;
}