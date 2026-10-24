# TwigAnimate

Copyright (C) 2026 Dhia, based on work by Alessio (filippocalippo).

TwigAnimate is an independently maintained fork of
[filippocalippo/StykAnimate-App](https://github.com/filippocalippo/StykAnimate-App).
It is not an official release of, affiliated with, or endorsed by the upstream
project, Pivot Animator, or Stick Nodes. The original repository and required
attribution remain part of this project's history.

**Modifications:** This fork changes the product identity, release configuration,
and selected application services. These modifications are distributed under
GPL version 3 or any later version, as permitted by GPL section 5(a).

The editor works locally. It continues to open and save TwigAnimate project,
figure, and movieclip files and import compatible Pivot Animator and Stick
Nodes files. Compatibility-related file extensions and MIME identifiers are
intentionally retained.

## Build and run

Requirements: Node.js 24 and Python 3.12. Install dependencies from the
repository root:

```sh
npm ci
python -m pip install -r backend/requirements-fast.txt
```

Run the desktop editor with `npm start`. Run the browser editor with
`npm run serve`, then open <http://127.0.0.1:47831>.

## Checks

```sh
npm run check
npm test
python -m unittest discover -s backend -p "test_*.py"
```

Browser, desktop, native packaging, and localization checks have separate
commands in [package.json](package.json). Platform packaging prerequisites are
documented in [desktop/README.md](desktop/README.md).

## Releases and updates

Automatic updates are disabled. The application does not check an upstream feed,
and release publishing is guarded for `dhia336/TwigAnimate`. The maintainer must
rename the GitHub repository, authenticate the GitHub CLI, and explicitly
configure `TWIGANIMATE_RELEASE_REPOSITORY=dhia336/TwigAnimate` before publishing.
No update endpoint or release credential is included in this repository. See
[docs/UPDATES.md](docs/UPDATES.md).

## License and notices

This project is licensed under the
[GNU General Public License, version 3 or (at your option) any later version](LICENSE).
Do not remove upstream copyright notices or third-party attributions. See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for bundled components.
