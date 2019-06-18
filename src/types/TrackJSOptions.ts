import { TrackJSCapturePayload } from "./TrackJSCapturePayload";

export interface TrackJSOptions {
  token: string,
  application?: string,
  metadata?: { [key: string]: string },
  onError?: (payload: TrackJSCapturePayload) => boolean,
  sessionId?: string,
  userId?: string,
  version?: string,
}
