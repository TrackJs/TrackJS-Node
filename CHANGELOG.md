# Changelog

## 1.0.2

Update packages and verify new node version

- Upgraded internal dev tools
- Upgraded Typescript
- Verified compatibility with node 18 LTS

## 1.0.1

Fixes required for Node 14 and 15.

- Fixed express errors in async code would not be attributed to the request.
- Fixed rejected promises not recorded in Node 15 due to serialization of strings.
- Fixed error correlation was always being reset.

## 1.0.0

- Stable Release.

## 0.0.12

- Fixed issue where we could not discover modules (dependencies) in restrictive cloud environments.

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
