# Palette source files

1. Add **PNG**, **JPEG**, or **WebP** swatches (flat fills or photos— the page **averages** pixel color).
2. Use **descriptive filenames** (they become the human-readable label and part of the CSS variable), e.g. `brand-primary-navy.png`, `accessory-gold-foil.jpg`.
3. Edit **`manifest.json`** in this folder:
   - **`brand`**: core brand colors (header uses the first one that loads successfully).
   - **`accessory`**: supporting / decorative colors.

Current `manifest.json` (checked in to match repo assets):

```json
{
  "brand": [
    "artisti-brand-logo.png",
    "artisti-logo-white.png",
    "artisti-logo-darker-bg.jpg",
    "artisti-all-brand-colors.jpg"
  ],
  "accessory": [
    "artisti-graded-blue-bg.jpg",
    "artisti-darker-bg_black-text.jpg",
    "artisti-archivio-old-paper.png",
    "artisti-pink.jpg",
    "artisti-red-extra-color.jpg"
  ]
}
```

- **Brand** — default logo (`artisti-brand-logo.png`), white mark for dark headers (`artisti-logo-white.png`), logo on dark background, full brand-color reference sheet.  
- **Accessory** (order = story on the page): graded blue wash → dark teal + black type → archive old paper → lilac pink accent → CTA red. Human captions live in **`ACCESSORY_CAPTIONS`** in **`js/pages/palette.js`** (edit there when you add files).

Two **brand chart** colors (**`--color-brand-prime-blue`**, **`--color-brand-prime-navy`**) from the composite chart are listed first in the Brand row in **`brand-swatches.html`** (hex in `:root`); manifest images append after them.

Paths are **relative to this folder** (filenames only, no `assets/` prefix).

Then reload **`brand-swatches.html`** on GitHub Pages (or **`index.html`** for the hex-only color boards).
