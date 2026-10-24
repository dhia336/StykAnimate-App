# Branding assets

The SVGs in `svg/` are clearly marked temporary TwigAnimate placeholders, not a
finished product logo. Replace them with independently created TwigAnimate artwork
before distributing branded builds. No upstream logo is included.

`npm run build:brand` rasterizes `svg/twiganimate-app-icon.svg` into the native
PNG/ICO/ICNS files in `desktop/assets`, copies that tile to the favicon `mark.svg`, and copies
`svg/twiganimate-symbol.svg` to `symbol.svg`. Replace the source SVGs, then regenerate native
assets with that command and web icons with `node scripts/build-web-icons.mjs`.

The current SVGs intentionally use a plain monogram as a temporary identity.
The separate font license remains in `Inter-LICENSE.txt`.

Before distributing a branded build, replace these source placeholders:

- `svg/twiganimate-app-icon.svg`: square 512×512 app icon artwork; keep its
  rounded-square background, centered safe-area artwork, and transparent
  outer corners.
- `svg/twiganimate-symbol.svg`: standalone 64×64 transparent symbol for the
  editor header and dialogs.
- `mark.svg` and `symbol.svg` are generated copies. Do not edit them directly.
- `desktop/assets/twiganimate.ico` contains 16, 20, 24, 32, 40, 48, 64, 128,
  and 256px images; `twiganimate.icns` contains 16–1024px representations;
  `twiganimate.png` is 512×512 and `twiganimate-1024.png` is 1024×1024.
- `web/icons/icon-192.png` is 192×192; `icon-512.png` and
  `icon-maskable-512.png` are 512×512; `apple-touch-icon.png` is 180×180.

After replacing the SVGs, run `npm run build:brand` and
`node scripts/build-web-icons.mjs`. Verify the generated native assets with
`node scripts/verify-brand-assets.mjs --assets-only`.
