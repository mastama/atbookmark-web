# Feature Spec: Smart CTA Button (Hybrid Flow)

**Goal:** Create a reusable "Get Extension" button that intelligently routes users based on their authentication status.

---

## 1. COMPONENT SPECIFICATION
**Name:** `InstallExtensionButton.tsx`
**Path:** `components/landing/InstallExtensionButton.tsx`

### 1.1 UI Design
* **Style:** Primary Neo-brutalism button (High contrast, shadow, bold text).
* **Icon:** Chrome Icon (or generic Puzzle icon).
* **Text:** "Get Browser Extension" (Changed from "Install..." to reflect the setup flow).
* **States:**
    * **Default:** Clickable.
    * **Loading:** Show spinner/loader when auth state is being checked or redirection is happening.

### 1.2 Interaction Logic (The Hybrid Flow)
When clicked, the button must check `useAuth()`:

1.  **Scenario A: User is Logged In**
    * **Action:** Redirect directly to the Extension Dashboard.
    * **Route:** `/dashboard/extension`

2.  **Scenario B: User is Guest (Logged Out)**
    * **Action:** Redirect to Login page with a *return URL*.
    * **Route:** `/login?returnUrl=/dashboard/extension`
    * *Note:* This ensures that after they sign up/login, they are automatically taken to the extension setup page, not the default dashboard.

---

## 2. HERO SECTION UPDATE
**File:** `components/landing/Hero.tsx`
**Change:** Replace the hardcoded `<Button>` with the new `<InstallExtensionButton />` component.