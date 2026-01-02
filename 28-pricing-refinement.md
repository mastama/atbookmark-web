# atbookmark — Pricing, Limits & Modal Logic Refinement

**Goal:** Finalize the monetization logic, language localization, and user flow.

---

## 1. UPDATED FREEMIUM LIMITS (LOGIC)
Update `useOrganizationStore` and `useBookmarksStore` to enforce these exact limits:

| Feature | Free Plan | Pro Plan |
| :--- | :--- | :--- |
| **Folders** | Max **5** | Unlimited |
| **Tags** | Max **5** | Unlimited |
| **Archives** | Max **5** | Unlimited |
| **Total Bookmarks** | Max **100** | Unlimited |

* **Logic:** If a user hits any of these limits -> Trigger `ProModal`.

---

## 2. PRICING SECTION (LANDING PAGE) — ENGLISH 🇬🇧
The Landing Page UI must be in **English**, but the Currency remains **IDR (Rp)** because the target audience is Indonesia.

### A. Card 1: Free
* **Title:** "Starter"
* **Subtitle:** "Enough to organize your browser chaos."
* **Price:** **Rp 0** / forever
* **Button:** "Start for Free"
* **Features:**
    * [x] Save up to 100 Bookmarks
    * [x] 5 Custom Folders & Tags
    * [x] Sync Mobile & Desktop

### B. Card 2: Pro (Neo-Brutalism Yellow)
* **Badge:** "Most Popular 🔥"
* **Title:** "Second Brain"
* **Subtitle:** "Unlock your full potential with AI."
* **Price:** **Rp 29rb** / month (or Rp 290rb / year)
* **Button:** "Upgrade Now 🚀"
* **Features:**
    * [x] **Everything in Free, plus:**
    * [x] **Unlimited Storage & Folders**
    * [x] **AI Auto-Tagging & Summaries**
    * [x] **Nested Folders**
    * [x] **Custom Colors**
    * [x] **Dark Mode**

### C. Button Logic (User Flow)
* **If Guest (Not Logged In):**
    * Click "Start for Free" -> Redirect to `/register`.
    * Click "Upgrade Now" -> Redirect to `/register?plan=pro` (After reg, open ProModal).
* **If Logged In:**
    * Click "Start for Free" -> Redirect to `/dashboard`.
    * Click "Upgrade Now" -> **Open ProModal** immediately.

---

## 3. PRO MODAL (PAYMENT) — INDONESIAN 🇮🇩
The modal content remains in **Indonesian** for trust and clarity in payment.

### Content Updates
* **Header:** "Upgrade ke Pro ⚡️"
* **Price Display:**
    * Monthly: **Rp 29.000**
    * Yearly: **Rp 290.000** (Hemat 17%)
* **Payment Methods:**
    1.  **QRIS** (Primary) - Show a placeholder QR Code.
    2.  **Transfer Manual** (BCA) - Show Bank Details.
* **Remove:** "Money Back Guarantee" (Garansi Uang Kembali).

---

## 4. Q&A SECTION (LANDING PAGE) — ENGLISH 🇬🇧
Add these persuasive FAQs below the pricing cards.

1.  **"Why should I upgrade to Pro?"**
    * "The Free plan is great for starting, but Pro gives you unlimited space and AI superpowers to actually *remember* what you read."
2.  **"What payment methods do you accept?"**
    * "We accept QRIS (GoPay, OVO, Dana) and Bank Transfer (BCA, Mandiri)."
3.  **"Can I cancel anytime?"**
    * "Yes! There are no contracts. You can cancel directly from your dashboard."