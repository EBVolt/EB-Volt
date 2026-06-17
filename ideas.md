# EcoBelle Volt — Design Ideas

## Three Stylistic Approaches

### Approach A: "Tropical Electra"
A vibrant, sun-drenched aesthetic that blends Ghana's warm energy with clean EV tech. Deep forest greens meet electric lime accents on a warm cream base. Asymmetric layouts with diagonal section cuts. Probability: 0.07

### Approach B: "Dark Charge" ← CHOSEN
A bold, premium dark-mode experience — deep charcoal and midnight navy backgrounds with electric green (#22c55e) as the signature accent. Inspired by InstaVolt's confident, tech-forward identity but elevated with African warmth. Probability: 0.04

### Approach C: "Clean Horizon"
Crisp white and light grey foundation with bold green CTAs. Minimal, corporate-clean aesthetic. Probability: 0.06

---

## CHOSEN APPROACH: "Dark Charge"

### Design Movement
Dark-mode tech-premium with African warmth — a fusion of Silicon Valley EV aesthetics and Ghanaian energy.

### Core Principles
1. **Dark depth** — deep navy/charcoal backgrounds create premium feel and make green accents pop
2. **Electric green as the hero color** — #16a34a (EB Volt brand green) drives all CTAs, highlights, and interactive elements
3. **Asymmetric confidence** — diagonal cuts, offset layouts, full-bleed imagery break the grid
4. **Purposeful whitespace** — generous spacing signals quality and makes content breathe

### Color Philosophy
- Background: `oklch(0.12 0.01 240)` — deep navy-charcoal (not pure black, has depth)
- Surface: `oklch(0.18 0.01 240)` — card/section surfaces
- Primary Green: `oklch(0.55 0.18 145)` — EB Volt signature green
- Light Green: `oklch(0.72 0.18 145)` — hover/accent green
- Text: `oklch(0.95 0 0)` — near-white primary text
- Muted text: `oklch(0.65 0.01 240)` — secondary text

### Layout Paradigm
- Full-bleed hero with diagonal clip-path transition to dark section
- Sticky transparent nav that transitions to dark on scroll
- Feature sections alternate between full-width image-left/text-right and reverse
- Map section takes full viewport width
- Staggered card grids for station listings

### Signature Elements
1. **Green glow effects** — subtle box-shadow glows on cards, buttons, and active elements
2. **Diagonal section dividers** — clip-path cuts between sections for dynamic flow
3. **Lightning bolt motif** — echoes the EB Volt logo throughout as decorative element

### Interaction Philosophy
- Buttons scale down on press (scale 0.97), glow on hover
- Cards lift with shadow on hover
- Map pins pulse with green glow animation
- Smooth scroll with intersection observer fade-ins

### Animation
- Hero text: staggered word reveal, 80ms delay per word
- Section entrances: fade-up from 20px, 400ms ease-out, triggered by intersection
- Map pins: pulsing green glow animation (2s infinite)
- Stats counter: number count-up on scroll into view
- Nav: 200ms backdrop-blur transition on scroll

### Typography System
- Display: **Space Grotesk** (bold, geometric, modern) — headlines and hero text
- Body: **Inter** (readable, clean) — body copy and UI text
- Mono: **JetBrains Mono** — station IDs, technical data

### Brand Essence
Ghana's first premium EV charging network — for drivers who demand reliability, speed, and sustainability.
Adjectives: **Reliable · Pioneering · Clean**

### Brand Voice
Headlines are direct and empowering. CTAs are action-oriented. No filler.
Examples:
- "Charge Anywhere in Ghana. Arrive Confident."
- "Find a Charger. Reserve Your Spot. Drive Green."

### Wordmark & Logo
The existing EB Volt logo (green leaf + lightning bolt) is used as-is. Displayed at 140px wide in the nav.

### Signature Brand Color
`#16a34a` — EB Volt Electric Green
