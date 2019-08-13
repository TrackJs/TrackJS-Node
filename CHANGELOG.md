# Changelog

## 0.0.11

- Added `Access-Control-Expose-Headers` header for correlation header sharing.

## 0.0.6

Updates from initial beta and configuring UI.

- Updated capture URLs
- Sending `applicationPlatform`
- Using "real" entry values
- Default metadata for hostname, username, and cwd
- Stamping captured errors with a `TrackJS` key so customer can cross-reference
- Optionally send correlation header to client-side

## 0.0.5

Initial creation of the NodeJS Agent. Key differences with the Browser Agent:

- No helper functions, `attempt`, `watch`, or `watchAll`.
- No Visitor or Navigation Telemetry.
- Fewer options to configure environment integration. (Wait until we need them)
- No ability to customize the serializer. I think this is unused.
