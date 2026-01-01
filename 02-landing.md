# atbookmark — Landing Page UI Master Plan

**Reference:** `initial-plan.md`
**Inspiration:** Simpan Dulu (Cleanliness) + Readwise (Intelligence) + Gumroad (Playful Aesthetics)

You are a Senior Frontend Engineer and Product Designer.
Your task is to design and implement the **LANDING PAGE ONLY** for the *atbookmark* web application.

---

## 1. PRODUCT VISION & BRANDING
*atbookmark* is not just a bookmark manager; it is an **Intelligent Knowledge Garden**. It solves the "Tab Hoarding" anxiety by promising that saved content is not just stored, but organized by AI and accessible offline.

* **Vibe:** "Soft Pop" / Neo-Brutalism.
* **Colors:**
    * **Background:** Cream `#FDFBF7`
    * **Primary Action:** Electric Indigo `#6366F1`
    * **Highlights:** Gen-Z Yellow `#FACC15` (for warnings/highlights)
    * **Text:** Dark Ink `#1E1B4B`
* **Typography:** *Plus Jakarta Sans* (Headings) + *Inter* (Body).
* **Shape Language:** Thick borders (2px), heavy soft shadows (`box-shadow: 4px 4px 0px #000`), rounded corners (`rounded-xl`).

---

## 2. SCOPE LIMITATION
* **Frontend UI only** (Next.js 14 + Tailwind).
* **No backend logic** (Use mock data arrays).
* **No auth logic** (Buttons link to `#`).
* **Responsiveness:** Mobile-responsive but Desktop-first visual impact.

---

## 3. SECTIONS TO IMPLEMENT

### A. Navigation Bar (Sticky)
* **Left:** Logo (Bold text with a bookmark icon emoji 🔖).
* **Center:** Links (Features, Pricing, Manifesto).
* **Right:**
    * "Login" (Text Link).
    * "Get Extension" (Button, Indigo background, Yellow hover).

### B. Hero Section: "The Chaos Killer"
* **Headline:** "Stop Drowning in Tabs. Start Building Knowledge."
* **Subheadline:** "The AI-powered bookmark manager that frees your RAM, summarizes your reading, and organizes your chaos automatically."
* **Primary CTA:** "Save Your First Link — Free" (With a 'sparkle' icon).
* **Secondary CTA:** "View the Demo".
* **Hero Visual (Split Layout):**
    * *Left:* Text & CTAs.
    * *Right (Animation):* A chaotic pile of browser tabs (Chrome UI style) being "sucked" into a neat, colorful Bento Grid card system.
    * *Floating Badge:* "RAM Usage: -80% 📉".

### C. The Pain Point: "Browser Bankruptcy"
* **Goal:** Empathize with the user's stress (similar to Simpan Dulu's "Laptop Panas").
* **Visual Metaphor:** An illustration of a laptop sweating or a system warning dialog saying "Memory Full".
* **Copy:**
    * "Your browser is eating 4GB of RAM."
    * "You have 50 tabs open 'just in case'."
    * "You can't find that one article from last week."

### D. Feature Highlights ( The "Superior" Upgrades)
*Use a Masonry/Bento Grid layout for these cards.*

1.  **🤖 The AI Librarian (Auto-Tagging)**
    * *Icon:* Robot Head / Magic Wand.
    * *Copy:* "No more manual tagging. Our AI scans the content and assigns `#React`, `#Cooking`, or `#Finance` automatically."
2.  **🧠 RAM Rescuer (Tab Suspender)**
    * *Icon:* Ice Cube / Snowflake.
    * *Copy:* "One-click 'Bulk Save'. We close your 20 idle tabs and save them into a 'Session' folder instantly. Cool down your laptop."
3.  **✈️ Offline Zen Reader**
    * *Icon:* Eye / Airplane.
    * *Copy:* "Bad internet? No problem. We cache the article text so you can read ad-free, anywhere. Even in a tunnel."
4.  **🔍 Full-Brain Search**
    * *Icon:* Search Loupe.
    * *Copy:* "Don't just search titles. Search the *content* inside every webpage you've ever saved."

### E. Interactive "How It Works"
* **Concept:** A simplified timeline or slider.
    1.  **Snap:** User hits `Alt+S` (Show a keyboard animation).
    2.  **Sort:** AI categorization happens (Show tags appearing magically).
    3.  **Sync:** Available on Phone & Desktop immediately.

### F. Social Proof (The Vibe Check)
* **Format:** Horizontal scrolling marquee.
* **Content:** Tweets/Testimonials from Developers, Designers, and Students.
    * *"I finally closed my 400 tabs. My laptop fan stopped spinning. Thank you atbookmark."*
    * *"The AI summary feature saves me hours of reading."*

### G. Final CTA: "Your New Homepage"
* **Background:** Gen-Z Yellow `#FACC15` (High energy).
* **Headline:** "Ready to clear your mind?"
* **Button:** "Install Chrome Extension" (Large, Black button, White text).
* **Micro-copy:** "Free forever for up to 100 bookmarks."

---

## 4. UX & MOTION GUIDELINES (Framer Motion)
* **Hover Effects:** Buttons should `scale: 0.95` on click. Cards should `translate-y: -4px` and increase shadow on hover.
* **Scroll Reveal:** Elements should fade in and slide up (`y: 20 -> y: 0`) as the user scrolls.
* **Hero Animation:** The transition from "Messy Tabs" to "Clean Cards" must be looped and smooth.

---

## 5. DELIVERABLES
1.  `page.tsx` (Main layout).
2.  `components/Hero.tsx`
3.  `components/FeaturesBento.tsx` (The upgraded feature grid).
4.  `components/PainPoint.tsx` (The RAM warning section).
5.  `components/Footer.tsx`