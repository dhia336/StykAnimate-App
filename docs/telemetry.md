# Diagnostics and support

TwigAnimate does not send telemetry, diagnostics, support requests, crash
reports, or project data to the original project's services. The desktop
application has no telemetry or support-service IPC bridge, no configured
service endpoint, and no first-run diagnostics consent prompt.

The editor may collect temporary measurements in memory to support local
rendering and playback behavior. Those measurements are not uploaded or
persisted as telemetry. The performance-trace command is an explicit local
export chosen by the user and is not sent anywhere by the application.

There is no automatic update feed configured. Update checks report that
updates are unavailable until the fork maintainer configures and publishes a
separate release channel.
