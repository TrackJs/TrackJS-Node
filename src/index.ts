"use awesome";

import * as sdk from "./sdk";
export const TrackJS = sdk;

export { TrackJSCapturePayload, TrackJSError, TrackJSInstallOptions, TrackJSOptions } from "./types/index";

export { RELEASE_NAME as name, RELEASE_HASH as hash, RELEASE_VERSION as version } from "./version";
