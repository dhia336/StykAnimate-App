# StykAnimate-Max

StykAnimate-Max is an independently maintained fork of
[filippocalippo/StykAnimate-App](https://github.com/filippocalippo/StykAnimate-App),
maintained by Dhia. It is not an official upstream release and is not affiliated
with or endorsed by the original maintainers. The upstream name and attribution
are retained to document the project's origin and compatibility.

The editor works locally and reads existing StykAnimate, Pivot Animator, and
Stick Nodes project and figure formats. Their file extensions, MIME types, and
protocol identifiers remain compatible.

## Build from source

### Requirements

- Node.js 22 or newer
- Python 3.11 or newer

### Install dependencies

```sh
npm ci
python -m pip install -r backend/requirements-fast.txt
```

### Run the app

Start the desktop app:

```sh
npm start
```

To run the browser version locally:

```sh
npm run serve
```

Then open <http://127.0.0.1:47831> in your browser.

### Checks and tests

```sh
npm run check
npm test
```

Some desktop, browser, packaging, and backend tests need additional tools or
dependencies. See `package.json` for the available test and build commands.
For packaging requirements and platform-specific installer instructions, see
[desktop setup](desktop/README.md). `npm run web:build` creates a local browser
build; deployment requires the fork maintainer to configure their own hosting.

## Updates and releases

Automatic updates are disabled. No fork update feed or published release
destination is configured. Publishing requires an explicit
`STYK_RELEASE_REPOSITORY=dhia336/StykAnimate-App` confirmation and authenticated
GitHub CLI access. Read the [update configuration guide](docs/UPDATES.md) before
publishing; do not use upstream release infrastructure.

## Upstream services

The app can read the original project's public community library. Optional
telemetry and user-initiated support requests also use upstream-hosted services.
Those services are not operated by this fork. No donation or developer-support
link is configured yet; Dhia can add a personal link when one is available.

## License and attribution

This project is licensed under the
[GNU General Public License, version 3 or (at your option) any later version](LICENSE).
Existing copyright notices, third-party notices, bundled licenses, and upstream
attribution are preserved. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
