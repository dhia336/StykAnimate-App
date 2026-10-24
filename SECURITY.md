# Security policy

## Supported versions

StykAnimate-Max has no published release channel or automatic updater yet.
Use source builds from this fork until a fork-maintained release is available.

## Reporting a vulnerability

Please do not report security problems in a public issue.

- **Preferred:** use this fork's [private vulnerability reporting](https://github.com/dhia336/StykAnimate-App/security/advisories/new), when enabled.
- **If unavailable:** contact the repository owner privately through the [GitHub profile](https://github.com/dhia336).

Include the version and platform, what an attacker could do, and steps or a file that reproduces the issue. Do not include files or information you are not allowed to share.

## Scope

In scope:

- **Opening files:** crafted `.styk`, `.piv`, `.stk`, Stick Nodes files or images.
- **The Electron app:** context isolation, preload API, and `stykanimate://` handling.
- **The browser build:** its service worker.
- **Release tooling:** installer verification and repository-target guards.

The public community library remains an upstream service. Report issues with that
service to the [upstream repository](https://github.com/filippocalippo/StykAnimate-App);
this fork does not operate its website or library backend.
