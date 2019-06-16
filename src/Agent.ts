import https from 'https';
import { TrackJSOptions } from './types/TrackJSOptions';
import TelemetryBuffer from "./telemetry/TelemetryBuffer";
import ConsoleWatcher from './ConsoleWatcher';

export default class Agent {

  static defaults:TrackJSOptions = {
    token: '',
    application: '',
    sessionId: '',
    userId: '',
    version: ''
  }

  options:TrackJSOptions
  telemetry:TelemetryBuffer

  constructor(options: TrackJSOptions) {
    this.options = Object.assign({}, Agent.defaults, options);
    this.telemetry = new TelemetryBuffer(30);

    ConsoleWatcher.install(this);
  }

  captureError(error: Error): Promise<string> {
    return new Promise((resolve, reject) => {
      var req = https.request({
        method: 'POST',
        hostname: 'dev-capture.trackjs.com',
        port: 443,
        path: `/capture?token=${this.options.token}&v=3.3.0`
      }, (res) => {
        var data = ''
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data || "OK"))
      })
      req.on('error', (error) => reject(error))
      req.write(JSON.stringify({
        "bindStack": null,
        "bindTime": null,
        "console": this.telemetry.getAllByCategory('c'),
        "customer": {
          "application": this.options.application,
          "correlationId": "1234",
          "sessionId": this.options.sessionId,
          "token": this.options.token,
          "userId": this.options.userId,
          "version": this.options.version
        },
        "entry": "server",
        "environment": {
          "age": 0,
          "dependencies": {
            "name": "1.0.0"
          },
          "originalUrl": "http://example.com/",
          "referrer": "http://example.com/",
          "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36",
          "viewportHeight": 0,
          "viewportWidth": 0
        },
        "file": "",
        "message": error.message,
        "metadata": [],
        "nav": [],
        "network": this.telemetry.getAllByCategory('n'),
        "url": "http://example.com/",
        "stack": error.stack,
        "throttled": 0,
        "timestamp": new Date().toISOString(),
        "visitor": [],
        "version": "3.0.0"
      }))
      req.end()
    })
  }

}
