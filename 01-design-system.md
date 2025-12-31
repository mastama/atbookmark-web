# atbookmark — Design System
(Annotasi Ecosystem)

Refer to `00-initial-plan.md` for:
- Product vision
- Scope limitations
- Frontend-only constraints

You are a Senior Product Designer and Frontend Engineer.

Your task is to define and standardize the DESIGN SYSTEM ONLY
for the atbookmark web application.

⚠️ IMPORTANT:
- This file defines visual rules only
- No page layouts
- No backend logic
- No business logic
- This design system must be reused across all pages & components

--------------------------------------------------
1. DESIGN PHILOSOPHY
--------------------------------------------------
Design Style:
- Neo-Brutalism meets Soft Pop
- Friendly, playful, modern
- Avoid corporate SaaS look
- Expressive but readable
- UI should feel "alive" but not chaotic

Core feelings:
- Bright
- Approachable
- Calm for reading
- Fun for interaction

--------------------------------------------------
2. COLOR SYSTEM
--------------------------------------------------

### Base Colors
- Background Primary: #FDFBF7 (Off-white / Cream)
- Background Secondary: #FFFFFF
- Surface (Cards): #FFFFFF
- Border Default: #1F2937 (Dark neutral)

### Brand Colors
- Primary (Action):
  - Electric Indigo: #6366F1
- Secondary (Highlight):
  - Gen Z Yellow: #FACC15

### Accent Colors (Tags & Labels)
- Mint: #6EE7B7
- Lavender: #C4B5FD
- Coral: #FB7185
- Sky Blue: #7DD3FC
- Peach: #FDBA74

### Text Colors
- Text Primary: #111827
- Text Secondary: #4B5563
- Text Muted: #9CA3AF
- Text Inverted: #FFFFFF

### Status Colors
- Success: #22C55E
- Warning: #F59E0B
- Error: #EF4444
- Info: #0EA5E9

--------------------------------------------------
3. TYPOGRAPHY
--------------------------------------------------

### Font Families
- Heading:
  - "Plus Jakarta Sans" OR "Outfit"
- Body / Reading:
  - "Inter"

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- SemiBold: 600
- Bold: 700

### Font Scale
- Display / Hero: 48–56px
- H1: 36px
- H2: 28px
- H3: 22px
- Body: 16px
- Small: 14px
- Caption: 12px

### Line Height
- Headings: 1.2
- Body text: 1.6
- Reader mode: 1.75

--------------------------------------------------
4. SPACING SYSTEM
--------------------------------------------------

Use a 4px base scale.

| Token | Size |
|-----|-----|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

Usage:
- Page padding: 24–32px
- Card padding: 16–24px
- Section spacing: 48–64px

--------------------------------------------------
5. BORDER & RADIUS
--------------------------------------------------

- Default Border Width: 2px
- Card Radius: 16px
- Button Radius: 12px
- Input Radius: 10px
- Tag Radius: 999px (pill)

Borders should be:
- Visible
- Slightly bold
- Dark neutral (not light gray)

--------------------------------------------------
6. SHADOWS
--------------------------------------------------

- Soft Shadow (default cards):
  box-shadow: 0 6px 0 rgba(0,0,0,0.08)

- Hover Shadow:
  box-shadow: 0 10px 0 rgba(0,0,0,0.12)

- Modal Shadow:
  box-shadow: 0 20px 40px rgba(0,0,0,0.15)

--------------------------------------------------
7. BUTTON SYSTEM
--------------------------------------------------

### Primary Button
- Background: #6366F1
- Text: White
- Border: 2px solid #1F2937
- Hover: Slight lift
- Active: Press-down animation (scale 0.96)

### Secondary Button
- Background: #FACC15
- Text: #111827
- Border: 2px solid #1F2937

### Ghost Button
- Transparent background
- Border only
- Used for secondary actions

--------------------------------------------------
8. INPUT & FORM ELEMENTS
--------------------------------------------------

- Height: 44–48px
- Rounded corners
- Thick border
- Focus ring:
  - 2px solid Primary color
- Placeholder:
  - Muted text color

--------------------------------------------------
9. CARD COMPONENT RULES
--------------------------------------------------

Cards should:
- Have clear visual separation
- Use cover images or gradients
- Show hierarchy:
  Title > Meta > Tags
- Animate slightly on hover:
  - Scale 1.02
  - Shadow increase

--------------------------------------------------
10. TAG & LABEL SYSTEM
--------------------------------------------------

Tags:
- Pill-shaped
- Soft pastel background
- Dark text
- Small font (12–14px)

Each tag color should feel:
- Calm
- Non-aggressive
- Distinguishable

--------------------------------------------------
11. MOTION & ANIMATION
--------------------------------------------------

Use Framer Motion.

Principles:
- Motion should guide, not distract
- Fast & snappy

Durations:
- Micro-interaction: 120–180ms
- Page transition: 200–300ms

Easing:
- ease-out
- spring (low bounce)

Examples:
- Button press
- Card hover
- Modal open/close
- Toast notifications

--------------------------------------------------
12. EMPTY STATE DESIGN
--------------------------------------------------

Empty states should:
- Be friendly
- Use illustration or emoji
- Encourage action

Tone example:
"You haven’t saved anything yet ✨  
Start building your library."

--------------------------------------------------
13. RESPONSIVE RULES
--------------------------------------------------

- Desktop-first
- Sidebar collapses on mobile
- Grid reduces columns progressively
- Touch-friendly buttons

--------------------------------------------------
14. DESIGN SYSTEM CONSTRAINTS
--------------------------------------------------

DO:
- Use bright accents sparingly
- Maintain reading comfort
- Keep layouts breathable

DO NOT:
- Overuse gradients
- Use pure white backgrounds everywhere
- Mix too many font families
- Add heavy animations

--------------------------------------------------
END OF DESIGN SYSTEM
--------------------------------------------------