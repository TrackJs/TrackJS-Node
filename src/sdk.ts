import http from 'http';
import { TrackJSInstallOptions, TrackJSOptions, TrackJSError, TrackJSCapturePayload, TrackJSNetwork } from './types';
import { Agent }  from './Agent';
import { expressRequestHandler, expressErrorHandler } from './handlers/express';
import { ConsoleTelemetry, NetworkTelemetry } from './telemetry';
import { AgentRegistrar } from './AgentRegistrar';
import { ConsoleWatcher, ExceptionWatcher, RejectionWatcher, Watcher } from './watchers';
import { isError } from './utils/isType';
import serialize from './utils/serialize';

let isInstalled = false;
let watchers: Array<Watcher> = [
  ConsoleWatcher,
  ExceptionWatcher,
  RejectionWatcher
];

export function install(options: TrackJSInstallOptions): void {
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

/**
 * Add a message to the Telemetry log.
 *
 * @param severity {String} "log","debug","info","warn","error"
 * @param messages Any messages to be added to the log
 */
export function addLogTelemetry(severity: string, ...messages: any): void {
  if (!isInstalled) { throw new TrackJSError('not installed.'); }
  AgentRegistrar.getCurrentAgent().telemetry.add('c', new ConsoleTelemetry(severity, messages));
}

/**
 * Add a network request to the Telemetry log.
 *
 * @param request {TrackJSNetwork|ClientRequest} The network request object to be logged
 * or an object describing the relevant properties.
 */
export function addNetworkTelemetry(request: TrackJSNetwork | http.ClientRequest): void {
  if (!isInstalled) { throw new TrackJSError('not installed.'); }
  AgentRegistrar.getCurrentAgent().telemetry.add('n', new NetworkTelemetry(request));
}

export function onError(func: (payload: TrackJSCapturePayload) => boolean): void {
  if (!isInstalled) { throw new TrackJSError('not installed.'); }
  AgentRegistrar.getCurrentAgent().onError(func);
}

/**
 * Sends a usage beacon for tracking error rates.
 */
export function usage(): void {
  if (!isInstalled) { throw new TrackJSError('not installed.'); }
  AgentRegistrar.getCurrentAgent().captureUsage();
}

/**
 * Track error data.
 *
 * @param data {*} Data to be tracked to the TrackJS service.
 * @param options {TrackJSOptions} Override the installation settings.
 */
export function track(data: any, options?: TrackJSOptions): boolean {
  if (!isInstalled) { throw new TrackJSError('not installed.'); }
  let error = isError(data) ? data : new Error(serialize(data));

  // The user wants to do a one-off track() that overrides agent options
  if (options) {
    return AgentRegistrar.getCurrentAgent().clone(options).captureError(error)
  }

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
