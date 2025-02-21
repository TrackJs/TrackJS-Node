import { TrackJSCapturePayload } from "./TrackJSCapturePayload";

export interface TrackJSInstallOptions extends TrackJSOptions {
  /**
   * @inheritdoc
   */
  token: string;
}

export interface TrackJSOptions {
  /**
   * Your TrackJS Account Token.
   */
  token?: string;

  /**
   * TrackJS Application Key
   */
  application?: string;

  /**
   * Identifier to correlate errors together share a common thread, session,
   * or request.
   * @property {String}
   */
  correlationId?: string;

  /**
   * The discovery and inclusion of default environment
   * metadata, such as hostname and username.
   * @default true
   */
  defaultMetadata?: boolean;

  /**
   * The discovery and inclusion of module dependencies with
   * error reports.
   * @default true
   */
  dependencies?: boolean;

  /**
   * URL destination override for capturing errors.
   */
  errorURL?: string;

  /**
   * URL destination override for agent fault reports.
   */
  faultURL?: string;

  /**
   * Metadata Key-Value pairs
   */
  metadata?: { [key: string]: string };

  /**
   * Network telemetry options
   */
  network?: {
    /**
     * Whether an error should be captured when a network request returns a 400 or greater status code
     */
    error?: boolean;

    /**
     * Whether network requests should automatically be recorded as Telemetry
     */
    enabled?: boolean;
  };

  /**
   * Custom callback handler for errors detected.
   */
  onError?: (payload: TrackJSCapturePayload) => boolean;

  /**
   * Custom user-session identifier.
   */
  sessionId?: string;

  /**
   * URL destination override for recording usage.
   */
  usageURL?: string;

  /**
   * Custom user id.
   */
  userId?: string;

  /**
   * Version id of your application.
   */
  version?: string;
}
