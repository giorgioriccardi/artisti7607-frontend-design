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
    "artisti-logo-darker-bg.jpg",
    "artisti-all-brand-colors.jpg"
  ],
  "accessory": [
    "artisti-graded-blue-bg.jpg",
    "artisti-red-extra-color.jpg"
  ]
}
```

- **Brand** — logo, logo on dark background, full brand-color reference sheet.  
- **Accessory** — graded blue environment / backgrounds, extra red accent.

The composite **`artisti-all-brand-colors.jpg`** also carries a Prime Video–style wordmark; two hex codes for that pair (**`--color-brand-prime-blue`**, **`--color-brand-prime-navy`**) are defined in **`index.html`** and were derived by **image sampling** (not automatic “read all swatches from the JPEG”). Re-run sampling if that file is replaced.

Paths are **relative to this folder** (filenames only, no `assets/` prefix).

Then reload **`index.html`** on GitHub Pages.
