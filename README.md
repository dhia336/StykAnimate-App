# StykAnimate-Max

StykAnimate-Max is an independently maintained fork of
[filippocalippo/StykAnimate-App](https://github.com/filippocalippo/StykAnimate-App).
It is maintained by Dhia.
It is not an official upstream release and is not affiliated with or endorsed by
the original maintainers. The upstream repository name and attribution are retained
to document the project's origin and compatibility.

The editor works locally and reads existing StykAnimate, Pivot Animator, and Stick
Nodes project and figure formats. Their file extensions, MIME types, and protocol
identifiers remain compatible.

## Build from source

Use Node.js 22 or newer and Python 3.11 or newer:

```sh
npm ci
npm start
```

To run the repository checks and unit tests:

```sh
npm run check
npm test
```

See [desktop setup and packaging](desktop/README.md) for build prerequisites and
platform-specific installer commands. `npm run web:build` creates a local browser
build; deployment requires a fork maintainer to configure their own hosting account.

## Updates and releases

Automatic updates are disabled. The repository has no configured fork update feed
or published release destination. Release publishing requires an explicit
`STYK_RELEASE_REPOSITORY=dhia336/StykAnimate-App` confirmation and authenticated
GitHub CLI access; see [the update configuration guide](docs/UPDATES.md) before
publishing. Do not use upstream release infrastructure.

The app can read the original project's public community library. That service
and its related external pages are maintained by upstream, not by this fork.

Optional telemetry and user-initiated support requests use upstream-hosted
services, which are not operated by this fork. No donation or developer-support
link is currently configured; Dhia can add a personal link when one is available.

## License and attribution

This project is licensed under the
[GNU General Public License, version 3 or (at your option) any later version](LICENSE).
Existing copyright notices, third-party notices, bundled licenses, and upstream
attribution are preserved. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
