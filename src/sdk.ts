import { TrackJSOptions, TrackJSError, TrackJSCapturePayload } from "./types/index";
import Agent from "./Agent";
import { expressErrorHandler } from './handlers/express';
import ConsoleTelemetryData from "./telemetry/ConsoleTelemetryData";

// the one agent to rule them all. A singleton.
let agent: Agent = null;

export function install(options: TrackJSOptions): void {
  if (agent) { throw new TrackJSError('already installed.'); }
  if (!options) { throw new TrackJSError('install options are required.' )}
  if (!options.token) { throw new TrackJSError('install token is required.' )}
  agent = new Agent(options);
}

export function uninstall(): void {
  if (!agent) { return; }
  agent.dispose();
  agent = null;
}

export function addMetadata(meta: string | { [key: string]: string}, value?: string) {
  if (!agent) { throw new TrackJSError('not installed.'); }
  return agent.metadata.add(meta, value);
}

export function removeMetadata(meta: string | { [key: string]: string}) {
  if (!agent) { throw new TrackJSError('not installed.'); }
  return agent.metadata.remove(meta);
}

export function addLogTelemetry(severity: string, ...messages: any): Symbol {
  if (!agent) { throw new TrackJSError('not installed.'); }
  return agent.telemetry.add('c', new ConsoleTelemetryData(severity, messages));
}

export function onError(func: (payload: TrackJSCapturePayload) => boolean) {
  if (!agent) { throw new TrackJSError('not installed.'); }
  return agent.onError(func);
}

export function track(error: Error): void {
  if (!agent) { throw new TrackJSError('not installed.'); }
  agent.captureError(error).catch((error) => null);
}

export const Handlers = {

  expressErrorHandler(): Function {
    if (!agent) { throw new TrackJSError('not installed.'); }
    return expressErrorHandler(agent);
  }

}
