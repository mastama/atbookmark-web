# Feature Spec: Pro Upgrade Flow (Manual QRIS MVP)

**Goal:** Allow users to upgrade to Pro using a familiar local payment method (QRIS) with zero technical overhead.

---

## 1. PRICING STRATEGY (IDR)
* **Monthly:** Rp 49.000 / bulan
* **Yearly:** Rp 490.000 / tahun (Hemat 2 bulan)
* **Currency:** IDR (Rupiah)

## 2. UI COMPONENT: `ProModal.tsx`

### 2.1 Header
* Title: "Unlock Your Second Brain"
* Sub: "Unlimited Access. No Anxiety."

### 2.2 Plan Selector
* Toggle Switch: [Monthly] vs [Yearly (Save 17%)]

### 2.3 Benefit List (Checkmarks)
* ✅ Unlimited Bookmarks & Folders
* ✅ AI Auto-Tagging & Summaries
* ✅ Forever Cloud Archive
* ✅ Priority Support via WhatsApp

### 2.4 Payment View (The "Checkout")
Instead of a credit card form, show:
1.  **QRIS Image:** A placeholder for the admin's QR Code.
2.  **Bank Details:** Bank BCA / Mandiri account number (text to copy).
3.  **Total Amount:** Dynamic based on selection (e.g., Rp 49.000).
4.  **Instructions:** "Scan QRIS above or transfer to bank account."

### 2.5 Action: Confirmation
* **Primary Button:** "Konfirmasi via WhatsApp" (Green Color).
* **Logic:** Opens WhatsApp API link with pre-filled text.
    * *Message:* "Halo Admin atBookmark, saya mau upgrade ke Pro Plan (Bulanan). Ini bukti transfer saya..."

---

## 3. USER FLOW
1.  User clicks "Upgrade" in Sidebar/Settings.
2.  Modal opens showing benefits + QRIS.
3.  User scans QRIS on their phone.
4.  User clicks "Konfirmasi via WhatsApp".
5.  WhatsApp opens -> User sends screenshot.
6.  Admin (You) manually activates "Pro" in database.