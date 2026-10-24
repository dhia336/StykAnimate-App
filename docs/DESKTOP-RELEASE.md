# Desktop build and release verification

The desktop workflow builds Windows x64 Setup and Portable installers and a Linux
x64 AppImage. It verifies the packaged files, startup and exports, then stores
the build and verification evidence as workflow artifacts. It does not create
or publish a GitHub release. Automatic updates are disabled for this fork.

The lockfile pins Electron, electron-builder and Playwright. The release workflow
uses Node 24.11.0 and Python 3.12.9. Windows also requires MSVC C++ build tools
and a Windows SDK; macOS and Linux use their host C++ compiler. Follow the build
prerequisites in [the release guide](RELEASING.md).

Every normal packaging command uses `--publish never`, including `npm run
pack`, `npm run dist`, and the platform-specific `dist:*` scripts. Building
locally cannot publish to either this fork or upstream. Windows uses the
unsigned installer configuration, and macOS packaging is not verified.

For a Windows package, build and verify the versioned artifacts on Windows:

```powershell
npm ci
npm run build:frame-scan
npm run build:vfw
npm run build:sidecar
npm run verify:sidecar
npm run build:video-encoder
$releaseVersion = (Get-Content package.json | ConvertFrom-Json).version
npm run dist:win -- --x64 "--config.directories.output=release/$releaseVersion"
$env:STYK_PACKAGED_RESOURCES = Join-Path $PWD "release/$releaseVersion/win-unpacked/resources"
$env:STYK_PACKAGED_EXECUTABLE = Join-Path $PWD "release/$releaseVersion/win-unpacked/StykAnimate-Max.exe"
npm run verify:package
npm run test:boot:packaged
npm run test:export:packaged
npm run release:verify -- "release/$releaseVersion" --platform=win32
```

Build Linux on its own host with `npm run dist:linux -- --x64`, then verify
`release/<version>` with `npm run release:verify -- release/<version>
--platform=linux`. These checks validate local installers; they do not install
or query an update feed.

If a maintainer later chooses to publish, [the update guide](UPDATES.md)
documents the explicit fork-only `release:publish` guard and its GitHub CLI
credential requirement. Publishing is not part of the automated workflow. See
[release history and shipping](RELEASING.md) for release-note preparation.
