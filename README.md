# SHALAGALLERY — Fine Art & Calligraphy by Asma Shala

A premium digital art gallery and portfolio website for Ireland-based fine artist and calligrapher **Asma Shala** operating under the brand **SHALAGALLERY**.

The website has been redesigned following the visual design system, typography, color scheme, and interaction patterns of the **Lily Portfolio** project, while preserving 100% of Asma Shala's authentic brand identity, artwork catalogue, and bespoke commission services.

---

## 1. Quick Start & Development

### Project Directory
`C:\Users\Dipesh\.gemini\antigravity\scratch\shalagallery`

### Running Locally
```bash
npm run dev
```
Open **[http://localhost:5174](http://localhost:5174)** in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 2. Design System & Aesthetics (Referenced from Lily Portfolio)

- **Typography**:
  - Headings (`font-serif`): `"Syncopate"`, `"Syne"`, `"Tenor Sans"`, sans-serif
  - Body & Metadata (`font-sans`): `"Outfit"`, `"Inter"`, sans-serif
  - Controlled letter-spacing (`tracking-[0.25em]`, `tracking-[0.35em]`, `tracking-[0.4em]`)
- **Color Palette & Semantic Tokens**:
  - **Dark Gallery Mode** (Default Exhibition Aesthetic):
    - Background: `#050505` (`gallery-black`)
    - Surface: `#0C0C0C` (`gallery-dark`)
    - Cards & Frames: `#141416`
    - Text: `#FAF9F6` (`warm-white`)
    - Text Muted: `rgba(250, 249, 246, 0.55)`
    - Accent: `#C5A86E` (metallic antique gold)
    - Borders: `rgba(255, 255, 255, 0.08)` / `0.18`
  - **Light Gallery Mode**:
    - Switchable anytime using the header sun/moon toggle button.
- **Micro-Interactions & Experience**:
  - **Dual-Element Custom Cursor**: Dynamic inner dot with lagging outer ring (`CustomCursor.tsx`).
  - **Scroll Progress Bar**: 2.5px gold progress bar pinned at the top.
  - **Magnetic Pull**: Smooth spring physics on navigation links, buttons, and social triggers (`Magnetic.tsx`).
  - **Fullscreen Handcrafted Lightbox**: Zoom controls, next/prev navigation, keyboard shortcuts (Escape, arrows), and collapsible metadata drawer (`ArtworkModal.tsx`).
  - **Physical Museum Frame**: Consistent padded casing with corner lines and status badges (`Frame.tsx`).
  - **Residential Scale Simulator**: Real-time room scale visualization with minimalist credenza (`RoomViewModal.tsx`).
  - **Floating Action Dock**: Quick email, Instagram, commission inquiry, and back-to-top buttons at bottom right.

---

## 3. Artist & Brand Data

- **Brand**: SHALAGALLERY
- **Artist**: Asma Shala
- **Location**: Ireland
- **Experience**:
  - 15+ years of artistic practice
  - 7 years of creating commissioned artwork
  - 140+ paintings sold to collectors in Ireland and internationally
  - Commissions have reached homes across 6 countries
- **Direct Email**: `shalagallery@gmail.com`
- **Instagram**: `@shalagallery` ([https://www.instagram.com/shalagallery/](https://www.instagram.com/shalagallery/))

---

## 4. How to Add Original Photography

Original artwork photographs can be placed in `public/artworks/` (e.g. `public/artworks/memories.jpg`).
Then update the `imageSrc` property in `src/data/artworks.ts`:

```typescript
{
  id: 'memories',
  title: 'Memories',
  category: 'Landscape & Realism',
  medium: 'Oil on Fine Canvas',
  dimensions: '70 × 50 cm',
  price: '€1,800 unframed',
  status: 'available',
  imageSrc: '/artworks/memories.jpg', // <-- set photo path here
  // ...
}
```
Until an original photo is added, the gallery displays digital exhibition canvases using the artist's palette and geometric motifs.

---

## 5. Commission Price Guide

| Size Code | Dimensions | Guide Investment |
| :--- | :--- | :--- |
| **A5** | 14.8 × 21 cm | €75 |
| **A4** | 21 × 29.7 cm | €145 |
| **A3** | 29.7 × 42 cm | €285 |
| **A2** | 42 × 59.4 cm | €450 |
| **A1** | 59.4 × 84.1 cm | €640 |
| **A0** | 84.1 × 118.9 cm | €900 |
| **Larger** | 120+ cm / Custom | €1,000+ |

*Pricing depends on size and detail. Professional framing is available upon request.*
