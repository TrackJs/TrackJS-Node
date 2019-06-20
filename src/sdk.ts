import { TrackJSOptions, TrackJSError, TrackJSCapturePayload } from './types';
import { Agent }  from './Agent';
import { expressRequestHandler, expressErrorHandler } from './handlers/express';
import { ConsoleTelemetry } from './telemetry';
import { AgentRegistrar } from './AgentRegistrar';
import { ConsoleWatcher, ExceptionWatcher, RejectionWatcher, Watcher } from './watchers';

let isInstalled = false;
let watchers: Array<Watcher> = [
  ConsoleWatcher,
  ExceptionWatcher,
  RejectionWatcher
];

export function install(options: TrackJSOptions): void {
  if (isInstalled) { throw new TrackJSError('already installed.'); }
  if (!options) { throw new TrackJSError('install options are required.' )}
  if (!options.token) { throw new TrackJSError('install token is required.' )}

  watchers.forEach((w) => w.install());

  AgentRegistrar.init(new Agent(options));
  isInstalled = true;
}

export function uninstall(): void {
  if (!isInstalled) { return; }
  watchers.forEach((w) => w.uninstall());
  AgentRegistrar.close();
  isInstalled = false;
}

export function addMetadata(meta: string | { [key: string]: string}, value?: string): void {
  if (!isInstalled) { throw new TrackJSError('not installed.'); }
  AgentRegistrar.getCurrentAgent().metadata.add(meta, value);
}

export function removeMetadata(meta: string | { [key: string]: string}): void {
  if (!isInstalled) { throw new TrackJSError('not installed.'); }
  AgentRegistrar.getCurrentAgent().metadata.remove(meta);
}

export function addLogTelemetry(severity: string, ...messages: any): void {
  if (!isInstalled) { throw new TrackJSError('not installed.'); }
  AgentRegistrar.getCurrentAgent().telemetry.add('c', new ConsoleTelemetry(severity, messages));
}

export function onError(func: (payload: TrackJSCapturePayload) => boolean): void {
  if (!isInstalled) { throw new TrackJSError('not installed.'); }
  AgentRegistrar.getCurrentAgent().onError(func);
}

export function track(error: Error): boolean {
  if (!isInstalled) { throw new TrackJSError('not installed.'); }
  return AgentRegistrar.getCurrentAgent().captureError(error);
}

export const Handlers = {

  expressErrorHandler(): Function {
    if (!isInstalled) { throw new TrackJSError('not installed.'); }
    return expressErrorHandler();
  },

  expressRequestHandler(): Function {
    if (!isInstalled) { throw new TrackJSError('not installed.'); }
    return expressRequestHandler();
  }

}
