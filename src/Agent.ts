import https from 'https';
import { TrackJSOptions, TrackJSConsole } from './types/index';
import TelemetryBuffer from './telemetry/TelemetryBuffer';
import ConsoleWatcher from './ConsoleWatcher';
import { TrackJSCapturePayload } from './types/index';
import { Metadata } from './Metadata';

export default class Agent {

  static defaults:TrackJSOptions = {
    token: '',
    application: '',
    sessionId: '',
    userId: '',
    version: ''
  }

  options:TrackJSOptions
  telemetry = new TelemetryBuffer(30)
  metadata = new Metadata()
  private _onErrorFns = []

  constructor(options: TrackJSOptions) {
    this.options = Object.assign({}, Agent.defaults, options);

    this.metadata = new Metadata(this.options.metadata);
    delete this.options.metadata;

    ConsoleWatcher.install(this);
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
        'age': 0,
        'dependencies': {
          'name': '1.0.0'
        },
        'originalUrl': 'http://example.com/',
        'referrer': 'http://example.com/',
        'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
        'viewportHeight': 0,
        'viewportWidth': 0
      },
      'file': '',
      'message': error.message,
      'metadata': this.metadata.get(),
      'nav': [],
      'network': this.telemetry.getAllByCategory('n'),
      'url': 'http://example.com/',
      'stack': error.stack,
      'throttled': 0,
      'timestamp': new Date().toISOString(),
      'visitor': [],
      'version': '3.0.0'
    };
  }

  onError(func: (payload: TrackJSCapturePayload) => boolean): void {
    this._onErrorFns.push(func);
  }

}
