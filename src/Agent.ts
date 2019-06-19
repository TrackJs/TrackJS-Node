import https from 'https';
import { TrackJSCapturePayload, TrackJSOptions, TrackJSConsole } from './types';
import { isFunction } from './utils/isType';
import TelemetryBuffer from './telemetry/TelemetryBuffer';
import { Metadata } from './Metadata';
import { Context } from './Context';
import { ConsoleWatcher, ExceptionWatcher } from './watchers';

export default class Agent {

  static defaults:TrackJSOptions = {
    token: '',
    application: '',
    sessionId: '',
    userId: '',
    version: ''
  }

  context = new Context();
  metadata = new Metadata()
  options:TrackJSOptions
  telemetry = new TelemetryBuffer(30)

  private _onErrorFns = [];
  private _watchers = [];

  constructor(options: TrackJSOptions) {
    this.options = Object.assign({}, Agent.defaults, options);

    if (isFunction(options.onError)) {
      this.onError(options.onError);
      delete this.options.onError;
    }

    this.metadata = new Metadata(this.options.metadata);
    delete this.options.metadata;

    this._watchers.push(new ConsoleWatcher(this));
    this._watchers.push(new ExceptionWatcher(this));
    this._watchers.forEach((watcher) => watcher.install());
  }

  captureError(error: Error): Promise<string> {
    return new Promise((resolve, reject) => {
      let payload = this.createErrorReport(error);
      let hasIgnored = false;
      this._onErrorFns.forEach((fn) => {
        if (!hasIgnored) {
          hasIgnored = !fn(payload);
        }
      });
      if (hasIgnored) {
        reject('TrackJS: error ignored.')
      }

      var req = https.request({
        method: 'POST',
        hostname: 'dev-capture.trackjs.com',
        port: 443,
        path: `/capture?token=${this.options.token}&v=3.3.0`
      }, (res) => {
        var data = ''
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data || 'OK'))
      })
      req.on('error', (error) => reject(error))
      req.write(JSON.stringify(payload))
      req.end()
    })
  }

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
        'age': now.getTime() - this.context.start.getTime(),
        'dependencies': {
          'name': '1.0.0'
        },
        'originalUrl': this.context.url,
        'referrer': this.context.referrerUrl,
        'userAgent': this.context.userAgent,
        'viewportHeight': 0,
        'viewportWidth': 0
      },
      'file': '',
      'message': error.message,
      'metadata': this.metadata.get(),
      'nav': [],
      'network': this.telemetry.getAllByCategory('n'),
      'url': this.context.url,
      'stack': error.stack,
      'throttled': 0,
      'timestamp': now.toISOString(),
      'visitor': [],
      'version': '3.0.0'
    };
  }

  onError(func: (payload: TrackJSCapturePayload) => boolean): void {
    this._onErrorFns.push(func);
  }

  dispose(): void {
    this._watchers.forEach((watcher) => watcher.uninstall());
    this._onErrorFns.length = 0;
    this._watchers.length = 0;
    this.telemetry = null;
    this.metadata = null;
  }

}
