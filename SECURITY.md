# Security policy

## Supported versions

TwigAnimate has no published release channel or automatic updater yet.
Use source builds from this fork until a fork-maintained release is available.

## Reporting a vulnerability

Please do not report security problems in a public issue. Contact the maintainer
privately at `<MY_CONTACT>`.

Include the version and platform, what an attacker could do, and steps or a file that reproduces the issue. Do not include files or information you are not allowed to share.

## Scope

In scope:

- **Opening files:** crafted `.styk`, `.piv`, `.stk`, Stick Nodes files or images.
- **The Electron app:** context isolation, preload API, and `twiganimate://` handling.
- **The browser build:** its service worker.
- **Release tooling:** installer verification and repository-target guards.

This fork does not include an upstream community-library, telemetry, or support
service integration.
