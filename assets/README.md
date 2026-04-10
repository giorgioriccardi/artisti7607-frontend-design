# Palette source files

1. Add **PNG**, **JPEG**, or **WebP** swatches (flat fills or photos— the page **averages** pixel color).
2. Use **descriptive filenames** (they become the human-readable label and part of the CSS variable), e.g. `brand-primary-navy.png`, `accessory-gold-foil.jpg`.
3. Edit **`manifest.json`** in this folder:
   - **`brand`**: core brand colors (header uses the first one that loads successfully).
   - **`accessory`**: supporting / decorative colors.

Example `manifest.json` after adding files:

```json
{
  "brand": [
    "brand-primary.png",
    "brand-secondary.png",
    "brand-accent-warm.png"
  ],
  "accessory": [
    "accessory-paper-cream.png",
    "accessory-metallic-bronze.png"
  ]
}
```

Paths are **relative to this folder** (filenames only, no `assets/` prefix).

Then reload **`index.html`** on GitHub Pages.
