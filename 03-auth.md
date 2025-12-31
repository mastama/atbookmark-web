# atbookmark — Authentication UI (Login, Register, & Recovery)

**Reference:** `00-initial-plan.md` & `01-design-system.md`
**Goal:** Create a frictionless, friendly entry point that feels like inviting a user into a creative studio.

---

## 1. PAGE STRUCTURE & LAYOUT
**Layout Style:** Split Screen (Desktop) / Full Card (Mobile)
* **Left Side (Visuals):** A dynamic, colorful panel showcasing the "Organized Chaos" vs "Zen Garden" metaphor.
* **Right Side (Form):** Clean, playful form container on the Cream background (`#FDFBF7`).

---

## 2. UI COMPONENTS

### A. The "Google" Button (Primary Option)
* **Style:** White background, 2px dark border, hard shadow.
* **Icon:** Colored Google "G" logo.
* **Text:** "Continue with Gmail" (Bold, Dark Ink color).

### B. Input Fields (Neo-Brutalism Style)
* **Background:** White.
* **Border:** 2px solid `#1F2937` (Dark Neutral).
* **Radius:** `rounded-lg` (12px).
* **Focus State:** Border color changes to **Electric Indigo** (`#6366F1`) + Hard Shadow appears.
* **Feature:** **Password Input** must include a "Show/Hide" toggle (Eye Icon) on the right side. Clicking it toggles text visibility.

### C. Action Button (Submit)
* **Style:** Background **Electric Indigo**, Text White, Border 2px Black, Hard Shadow.
* **Interaction:** Scale down on click.

---

## 3. PAGE SPECIFICATIONS

### 3.1 `/login`
1.  **Header:** "Welcome back, Collector."
2.  **Subheader:** "Ready to organize some chaos?"
3.  **Form:**
    * Button: Continue with Gmail.
    * Input: Email Address.
    * Input: Password (with Eye Icon).
    * Link: "Forgot password?" (Links to `/forgot-password`).
4.  **Footer:** "New here? **Create an account**" (Links to `/register`).

### 3.2 `/register`
1.  **Header:** "Join the Anti-Chaos Club."
2.  **Subheader:** "Your brain will thank you later."
3.  **Form:**
    * Button: Continue with Gmail.
    * Input: Email Address.
    * Input: Password (with Eye Icon).
    * Input: Confirm Password (with Eye Icon).
4.  **Footer:** "Already have an account? **Login**" (Links to `/login`).

### 3.3 `/forgot-password`
1.  **Header:** "Panic Mode? Off."
2.  **Subheader:** "Enter your email and we'll send a magic link."
3.  **Form:**
    * Input: Email Address.
    * Button: "Send Reset Link 📨".
4.  **Footer:** "Wait, I remembered! **Back to Login**".

---

## 4. INTERACTION & LOGIC (Mock)

### Authentication Flow
* **Login/Register:** On submit -> Loading (1.5s) -> Success Toast -> Push to `/dashboard`.
* **Logout Action:** (Simulated from Dashboard) -> Clear session -> Redirect to `/login` -> Show Toast: "You've been logged out safely 👋".

### Password Visibility
* Default: Masked (bullets).
* Click Eye Icon: Reveal text. Icon changes to "Eye Off".

### Forgot Password Flow
* Submit Email -> Loading (1s) -> Show Success State (replace form with: "Check your inbox! We sent a link to **[email]**").

---

## 5. ASSETS
* Icons: `Lucide React` (Mail, Lock, Eye, EyeOff, ArrowLeft).