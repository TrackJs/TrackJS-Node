import { TrackJSOptions, TrackJSError, TrackJSCapturePayload } from "./types/index";
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

export function addMetadata(meta: string | { [key: string]: string}, value?: string) {
  if (!agent) { throw new TrackJSError('not installed.'); }
  return agent.metadata.add(meta, value);
}

export function addLogTelemetry(severity: string, ...messages: any): Symbol {
  if (!agent) { throw new TrackJSError('not installed.'); }
  return agent.telemetry.add('c', new ConsoleTelemetryData(severity, messages));
}

export function onError(func: (payload: TrackJSCapturePayload) => boolean) {
  if (!agent) { throw new TrackJSError('not installed.'); }
  return agent.onError(func);
}

export function track(error: Error): Promise<string> {
  if (!agent) { throw new TrackJSError('not installed.'); }
  return agent.captureError(error);
}
