export interface TrackJSCapturePayload {
  bindStack?: string;
  bindTime?: string;
  console: Array<TrackJSConsole>;
  customer: {
    application: string;
    correlationId: string;
    sessionId: string;
    token: string;
    userId: string;
    version: string;
  };
  entry: string;
  environment: {
    age: number;
    dependencies: {
      [name: string]: string;
    };
    originalUrl: string;
    referrer: string;
    userAgent: string;
    viewportHeight: number;
    viewportWidth: number;
  };
  file: string;
  message: string;
  metadata: Array<TrackJSMetadata>;
  nav: Array<{}>;
  network: Array<TrackJSNetwork>;
  url: string;
  stack: string;
  throttled: number;
  timestamp: string;
  visitor: Array<{}>;
  version: string;
}

export interface TrackJSConsole {
  timestamp: string;
  severity: string;
  message: string;
}

export interface TrackJSMetadata {
  key: string;
  value: string;
}

/**
 * TrackJS Network Telemetry Item.
 */
export interface TrackJSNetwork {
  /**
   * Network Request complete time.
   * @property {String ISO 8601}
   * @example 2000-01-01T12:00:00.000Z
   */
  completedOn: string;

  /**
   * HTTP Method of the request. "GET","POST","UPDATE","DELETE","..."
   * @property {String}
   */
  method: string;

  /**
   * Network Request start time.
   * @property {String ISO 8601}
   * @example 2000-01-01T12:00:00.000Z
   */
  startedOn: string;

  /**
   * HTTP Status code of the completed request
   * @property {Number}
   */
  statusCode: number;

  /**
   * HTTP Status text of the completed request
   * @property {String}
   * @example "Not Found"
   */
  statusText: string;

  /**
   * URL destination of the request.
   * @property {String}
   */
  url: string;
}
