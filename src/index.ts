import https from 'https';
import { TrackJSOptions } from './interfaces/TrackJSOptions';
import { Agent } from './Agent';

let agent:Agent = null;

export var TrackJS = {

  install: function(options: TrackJSOptions): void {
    if (!options) { throw new Error('Install options are required. See https://docs.trackjs.com/' )}
    if (!options.token) { throw new Error('Install token is required. See https://docs.trackjs.com/' )}

    agent = new Agent(options);
  },

  track: function (error: Error): any {
    return new Promise((resolve, reject) => {
      var req = https.request({
        method: 'POST',
        hostname: 'dev-capture.trackjs.com',
        port: 443,
        path: `/capture?token=${agent.options.token}&v=3.3.0`
      }, (res) => {
        var data = ''
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data || "OK"))
      })
      req.on('error', (error) => reject(error))
      req.write(JSON.stringify({
        "bindStack": null,
        "bindTime": null,
        "console": [],
        "customer": {
          "application": agent.options.application,
          "correlationId": "1234",
          "sessionId": agent.options.sessionId,
          "token": agent.options.token,
          "userId": agent.options.userId,
          "version": agent.options.version
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
        "network": [],
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
