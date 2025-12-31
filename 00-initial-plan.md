You are a Senior Frontend Engineer and Product Designer.

Your task is to design and implement the FRONTEND ONLY
for a modern bookmark manager web app called "atbookmark",
part of the Annotasi ecosystem.

⚠️ IMPORTANT SCOPE LIMITATION:
- Focus ONLY on frontend (UI/UX + client-side logic)
- NO backend implementation
- NO database implementation
- Authentication is UI-only (mocked)
- Assume backend APIs will be connected later

--------------------------------------------------
1. PRODUCT VISION
--------------------------------------------------
atbookmark helps users save links, reduce browser tab overload,
and read content later in a clean, distraction-free way.

Core emotions:
- Playful
- Bright
- Friendly
- Lightweight
- Modern

Design inspiration:
- simpandulu.com
- vizard.ai dashboard
- Notion
- Pinterest (masonry grid)

--------------------------------------------------
2. DESIGN SYSTEM — "Playful & Bright"
--------------------------------------------------
Design Style:
- Neo-Brutalism / Soft Pop
- Avoid corporate SaaS (no boring blue/gray dominance)

Color Palette:
- Primary: Electric Indigo (#6366F1)
- Secondary: Gen Z Yellow (#FACC15)
- Background: Off-white / Cream (#FDFBF7)
- Accent tags:
  - Mint
  - Lavender
  - Coral
  - Sky Blue

Typography:
- Headers: Plus Jakarta Sans or Outfit
- Body / Reading: Inter

UI Elements:
- Cards with:
  - Rounded corners (16px)
  - Thick borders
  - Soft shadows
- Buttons:
  - Press-down animation on click
  - Hover scale & glow
- Micro-interactions:
  - Bookmark cards "pop" when added
  - Folder hover bounce
  - Skeleton loaders for content

--------------------------------------------------
3. TECH STACK (FRONTEND ONLY)
--------------------------------------------------
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Zustand or Context API (state)
- Mock API / dummy data (JSON)

--------------------------------------------------
4. AUTHENTICATION (UI ONLY)
--------------------------------------------------
Implement AUTH UI only (no real auth logic):

Login / Register options:
1. Continue with Google (Gmail)
   - Google-styled button
   - Mock success flow
2. Manual Email & Password
   - Email input
   - Password input
   - Confirm password (register)

Pages:
- /login
- /register

UX Notes:
- Friendly copy
- No technical jargon
- Soft transitions between login/register
- Success redirects to dashboard

--------------------------------------------------
5. CORE PAGES & FEATURES (FRONTEND)
--------------------------------------------------

A. Landing Page
- Hero:
  "Save now. Read later. No more tab chaos."
- CTA buttons:
  - Get Started (Register)
  - Login
- Feature highlights with playful icons
- Bright gradient sections

--------------------------------------------------

B. Dashboard Layout
Structure:
- Left Sidebar:
  - All Bookmarks
  - Favorites
  - Archive
  - Folders
  - Tags
  - Public Collections
- Top Bar:
  - Search input (Cmd + K style)
  - Add Bookmark button
  - User avatar menu

--------------------------------------------------

C. Bookmark View
Display style:
- Masonry / Pinterest-style grid
- Bookmark Card contains:
  - Cover image (mock)
  - Title
  - Short summary (mock text)
  - Reading time
  - Tags (colored pills)
  - Favorite & Archive icons

Actions:
- Hover actions
- Smooth animations
- Empty states when no bookmarks

--------------------------------------------------

D. Add Bookmark Modal
- URL input
- Folder selector
- Tag selector
- Save button with animation
- Success feedback ("Saved ✨")

--------------------------------------------------

E. Reader Mode (Frontend Only)
- Clean reading layout
- Adjustable font size
- Light background
- No ads / distractions
- Mock content text

--------------------------------------------------

F. Public Collection Page
- Shareable-looking public page
- Read-only
- Grid-based bookmark display
- Clean & minimal

--------------------------------------------------
6. UX DETAILS
--------------------------------------------------
- Skeleton loaders
- Empty state illustrations
- Friendly copywriting
- Keyboard-friendly navigation
- Smooth page transitions
- Responsive (desktop-first)

--------------------------------------------------
7. DELIVERABLES
--------------------------------------------------
- Folder structure
- Layout components
- UI components
- Auth pages (UI only)
- Dashboard UI
- Mock data
- Tailwind theme configuration
- Reusable card components

Do NOT include:
- Backend code
- Database schema
- Real authentication logic
- API integrations