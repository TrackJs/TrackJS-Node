import https from 'https';
import { TrackJSOptions, TrackJSError } from "./types/index";
import Agent from "./Agent";
import ConsoleTelemetryData from "./telemetry/ConsoleTelemetryData";

// the one agent to rule them all. A singleton.
let agent: Agent = null;

export function install(options: TrackJSOptions): void {
  if (agent) { throw new TrackJSError('already installed.'); }
  if (!options) { throw new TrackJSError('install options are required.' )}
  if (!options.token) { throw new TrackJSError('install token is required.' )}
  agent = new Agent(options);
}

export function addLogTelemetry(severity: string, ...messages: any): Symbol {
  if (!agent) { throw new TrackJSError('not installed.'); }
  return agent.telemetry.add('c', new ConsoleTelemetryData(severity, messages));
}

export function track(error: Error): any {
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
