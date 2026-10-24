# Native brand assets

Generated from `assets/brand/svg/twiganimate-app-icon.svg` using the checked-in
resvg WASM renderer. Run `npm run build:brand`; packaging regenerates these assets.
The current source artwork is an intentionally temporary placeholder and must be
replaced before distributing a branded build.

- `twiganimate.png`: 512px window/Linux icon.
- `twiganimate-1024.png`: high-resolution source raster.
- `twiganimate.ico`: 16, 20, 24, 32, 40, 48, 64, 128, and 256px; 32-bit alpha DIBs
  with transparency masks at smaller sizes and lossless PNG at 256px.
- `twiganimate.icns`: PNG representations from 16 to 1024px, including Retina types.

All app-icon tiles have transparent corners. Standalone in-app marks use the transparent
root `symbol.svg`, while the browser favicon uses the root `mark.svg` tile.

`win.signExecutable: false` intentionally leaves these beta builds unsigned while
electron-builder applies their icon and version resources. Do not restore
`signAndEditExecutable: false`: it also disables the application's icon update.
Setup, uninstaller, and installer header icons use the same ICO. File associations
inherit the application's icon. No code-signing service or paid dependency is used.
