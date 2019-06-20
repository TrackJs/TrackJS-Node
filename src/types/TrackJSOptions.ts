import { TrackJSCapturePayload } from "./TrackJSCapturePayload";

export interface TrackJSInstallOptions extends TrackJSOptions {
  /**
   * @inheritdoc
   */
  token: string,
}

export interface TrackJSOptions {
  /**
   * Your TrackJS Account Token.
   */
  token?: string,

  /**
   * TrackJS Application Key
   */
  application?: string,

  /**
   * URL destination override for capturing errors.
   */
  captureURL?: string,

  /**
   * Metadata Key-Value pairs
   */
  metadata?: { [key: string]: string },

  /**
   * Custom callback handler for errors detected.
   */
  onError?: (payload: TrackJSCapturePayload) => boolean,

  /**
   * Custom user-session identifier.
   */
  sessionId?: string,

  /**
   * URL destination override for recording usage.
   */
  usageURL?: string,

  /**
   * Custom user id.
   */
  userId?: string,

  /**
   * Version id of your application.
   */
  version?: string,
}
