# Branding assets

`stykanimate-max-app-icon.svg` and `stykanimate-max-symbol.svg` are the independent fork identity:
a stick-figure pose, glowing motion path and timeline keyframes, drawn as vector paths without
embedded images, fonts, scripts or network dependencies.
The `stykanimate-*` SVGs are retained as upstream attribution/reference assets only;
they are not used in StykAnimate-Max application builds.

`npm run build:brand` rasterizes `svg/stykanimate-max-app-icon.svg` into the native
PNG/ICO/ICNS files in `desktop/assets`, copies that tile to the favicon `mark.svg`, and copies
`svg/stykanimate-max-symbol.svg` to `symbol.svg`. Packaging runs it automatically, and native
icons keep their alpha outside the rounded corners.

`node scripts/verify-brand-assets.mjs --assets-only` checks transparency and size variants.
Without the flag it also compares a packaged Windows build's icon resources with the generated ICO.

The upstream StykAnimate name and marks identify the original project. StykAnimate-Max
is an independent fork and does not use those marks as its application identity.
