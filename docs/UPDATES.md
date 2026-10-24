# Fork releases and updates

StykAnimate-Max does not check the upstream release channel and does not
publish through Electron Builder. Automatic updates are intentionally disabled
until this fork has an owned release feed, verified credentials, and tested
installers. Installing or building the app does not contact the upstream release
repository.

## Publishing a release

The release publisher is guarded to accept only this fork repository:

```powershell
$env:STYK_RELEASE_REPOSITORY = "dhia336/StykAnimate-App"
gh auth status --hostname github.com
npm run release:publish
```

Before publishing, follow [the release preparation guide](RELEASING.md), build and
verify the platform artifacts, and check that the GitHub CLI is authenticated to an
account with release-write access to this fork. The publisher creates or updates
draft releases in `dhia336/StykAnimate-App` only; it rejects unset or different
repository values and never targets the upstream repository.

The package has no `publish` provider, and the desktop runtime supplies an
unavailable update state without loading an updater or making a release-feed
request. Publishing a release therefore does not enable automatic updates.

## Enabling automatic updates later

Do not re-enable updates by restoring the original provider settings. A maintainer
must choose and own a feed/provider for this fork, configure artifact naming and
update metadata for every supported platform, implement an explicit opt-in runtime
configuration, and add tests proving requests and installation can only target the
fork's endpoint. Verify signed or checksummed installers, cancellation, staged
replacement, and save-before-restart behavior on each target OS. Until then, users
must obtain builds from a release destination maintained by this fork, if one is
made available.
