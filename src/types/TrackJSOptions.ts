import { TrackJSCapturePayload } from "./TrackJSCapturePayload";

export interface TrackJSOptions {
  token: string,
  application?: string,

  /**
   * URL destination override for capturing errors.
   */
  captureURL?: string,

  metadata?: { [key: string]: string },
  onError?: (payload: TrackJSCapturePayload) => boolean,
  sessionId?: string,

  /**
   * URL destination override for recording usage.
   */
  usageURL?: string,

  userId?: string,
  version?: string,
}
