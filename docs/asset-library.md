# Local asset library

The Library panel stores and reuses figures and movieclips on the current
device. It has no public or community catalogue and makes no network requests.
The community-library interface and its upstream proxy have been removed.

## Desktop

The desktop app keeps saved assets under the user's Documents folder in
`TwigAnimate/library` by default. `TWIGANIMATE_LIBRARY_DIR` can select a
different local directory. Existing `.stkz` figure and `.stykmov` movieclip
files remain importable and exportable independently of the library.

## Browser

The browser app stores assets locally in the browser's IndexedDB library. They
are not uploaded or synchronized. Clearing that browser's site data can remove
the saved library.

## Compatibility

Pivot `.piv`/`.stk`, Stick Nodes files, and TwigAnimate `.styk`/`.stkz`/
`.stykmov` formats remain available through the existing import and export
flows. Removing the community catalogue does not change local figure or
movieclip import, saving, or insertion.
