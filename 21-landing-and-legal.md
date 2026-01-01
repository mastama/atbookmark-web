# Feature Spec: Landing Page Logic & Legal Compliance

**Goal:** Finalize the public-facing pages with dynamic CTA logic and standard legal protection documents.

---

## 1. HERO SECTION LOGIC
**File:** `components/landing/Hero.tsx` (or `app/page.tsx` if inline).

**Requirement:**
The primary CTA button "**Save Your First Link**" must be dynamic based on user authentication state.

**Logic:**
1.  **Check Auth State:** Use the existing `useAuth` context or Session check.
2.  **Condition:**
    * **If Logged In:** Button text: "Go to Dashboard" → Link: `/dashboard`
    * **If Logged Out:** Button text: "Save Your First Link" → Link: `/register` (or `/login`)
3.  **Visual:** Keep the same button styling (Neo-brutalism primary button).

---

## 2. FOOTER LINKS
**File:** `components/layout/Footer.tsx`

**Requirement:**
Update the footer links to point to real routes:
* Privacy Policy → `/privacy`
* Terms of Service → `/terms`

---

## 3. NEW PAGE: PRIVACY POLICY
**Route:** `app/privacy/page.tsx`
**Content Summary (Standard SaaS):**
* **Information We Collect:** Account info (email), Bookmark data (URLs, titles, metadata).
* **How We Use Information:** To provide the bookmarking service, improve features, and communicate updates.
* **Data Security:** We use industry-standard encryption. We do not sell data to advertisers.
* **User Rights:** You can export or delete your data at any time via Settings.

---

## 4. NEW PAGE: TERMS OF SERVICE
**Route:** `app/terms/page.tsx`
**Content Summary (Standard SaaS):**
* **Acceptance:** By using atBookmark, you agree to these terms.
* **User Responsibilities:** You are responsible for the content you save. Do not save illegal content.
* **Pro Plan:** Payments are non-refundable (or standard refund policy). We reserve the right to modify pricing with notice.
* **Termination:** We may terminate accounts that violate terms.
* **Disclaimer:** Service is provided "as is".

---

## 5. UI STYLING FOR LEGAL PAGES
* Use a simple, readable layout (Prose typography).
* Container: `max-w-3xl mx-auto py-12 px-4`.
* Headings: Bold Neo-brutalism font.
* Text: Gray-700, readable line-height.