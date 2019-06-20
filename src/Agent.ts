import https from 'https';
import { TrackJSCapturePayload, TrackJSOptions, TrackJSConsole } from './types';
import { isFunction } from './utils/isType';
import { TelemetryBuffer } from './telemetry';
import { Metadata } from './Metadata';
import { Environment } from './Environment';

export class Agent {

  static defaults:TrackJSOptions = {
    token: '',
    application: '',
    sessionId: '',
    userId: '',
    version: ''
  }

  environment = new Environment();
  metadata = new Metadata()
  options:TrackJSOptions
  telemetry = new TelemetryBuffer(30)

  private _onErrorFns = [];

  constructor(options: TrackJSOptions) {
    this.options = Object.assign({}, Agent.defaults, options);

    if (isFunction(options.onError)) {
      this.onError(options.onError);
      delete this.options.onError;
    }

    this.metadata = new Metadata(this.options.metadata);
    delete this.options.metadata;
  }

  /**
   * Capture an error report.
   *
   * @param error {Error} Error to be captured to the TrackJS Service.
   * @returns {Boolean} `false` if the error was ignored.
   */
  captureError(error: Error): boolean {
    let payload = this.createErrorReport(error);
    let hasIgnored = false;
    this._onErrorFns.forEach((fn) => {
      if (!hasIgnored) {
        hasIgnored = !fn(payload);
      }
    });
    if (hasIgnored) {
      return false;
    }

    var req = https.request({
      method: 'POST',
      hostname: 'dev-capture.trackjs.com',
      port: 443,
      path: `/capture?token=${encodeURIComponent(this.options.token)}&v=3.3.0`
    }, (res) => null);
    req.on('error', () => null) // TODO??
    req.write(JSON.stringify(payload))
    req.end();
    return true;
  }

  /**
   * Creates a copy of the current agent and the contextual logs and event
   * handlers. This allows for cloned objects to be later modified independently
   * of the parent.
   */
  clone(): Agent {
    let cloned = new Agent(this.options);
    cloned.metadata = this.metadata.clone();
    cloned.telemetry = this.telemetry.clone();
    cloned.environment = this.environment.clone();
    cloned._onErrorFns = this._onErrorFns.slice(0);
    return cloned;
  }

  /**
   * Generate a full error report payload for a given error with the context logs
   * gathered by this agent.
   *
   * @param error {Error} Error to base for the report.
   */
  createErrorReport(error: Error): TrackJSCapturePayload {
    let now = new Date();
    return {
      'bindStack': null,
      'bindTime': null,
      'console': this.telemetry.getAllByCategory('c') as Array<TrackJSConsole>,
      'customer': {
        'application': this.options.application,
        'correlationId': '1234',
        'sessionId': this.options.sessionId,
        'token': this.options.token,
        'userId': this.options.userId,
        'version': this.options.version
      },
      'entry': 'server',
      'environment': {
        'age': now.getTime() - this.environment.start.getTime(),
        'dependencies': {
          'name': '1.0.0'
        },
        'originalUrl': this.environment.url,
        'referrer': this.environment.referrerUrl,
        'userAgent': this.environment.userAgent,
        'viewportHeight': 0,
        'viewportWidth': 0
      },
      'file': '',
      'message': error.message,
      'metadata': this.metadata.get(),
      'nav': [],
      'network': this.telemetry.getAllByCategory('n'),
      'url': this.environment.url,
      'stack': error.stack,
      'throttled': 0,
      'timestamp': now.toISOString(),
      'visitor': [],
      'version': '3.0.0'
    };
  }

  /**
   * Attach a event handler to Errors. Event handlers will be called in order
   * they were attached.
   *
   * @param func {Function} Event handler that accepts a `TrackJSCapturePayload`.
   * Returning `false` from the handler will cause the Error to be ignored.
   */
  onError(func: (payload: TrackJSCapturePayload) => boolean): void {
    this._onErrorFns.push(func);
  }

  dispose(): void {
    this._onErrorFns.length = 0;
    this.telemetry = null;
    this.metadata = null;
  }

}
