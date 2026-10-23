# StykAnimate Fork

This repository is an independently maintained fork of [filippocalippo/StykAnimate-App](https://github.com/filippocalippo/StykAnimate-App).

It is based on the upstream StykAnimate project, a stick-figure animation editor with support for Pivot and Stick Nodes project files. This fork is not an official upstream release and is not affiliated with the original maintainer. Changes, builds, issues, and support for this fork belong here.

## Upstream project

- Source and original project history: [filippocalippo/StykAnimate-App](https://github.com/filippocalippo/StykAnimate-App)
- Upstream licensing and third-party notices are retained in this repository.

## Build from source

### Requirements

- Node.js 22 or newer
- Python 3.11 or newer

### Install dependencies

```bash
npm ci
python -m pip install -r backend/requirements-fast.txt
```

### Run

Start the desktop app:

```bash
npm start
```

Run the browser version locally:

```bash
npm run serve
```

Then open http://127.0.0.1:47831 in your browser.

### Checks and tests

```bash
npm run check
npm test
```

Some desktop, browser, packaging, and backend tests require additional tools or dependencies. See the scripts in `package.json` for available test and build commands.

## License and attribution

This fork retains the upstream project's GNU GPL v3-or-later license. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for license and third-party component details.

Upstream copyright and license notices must remain intact. This fork is identified separately to avoid confusion with official upstream releases.
