import { TrackJSInstallOptions, TrackJSOptions, TrackJSError, TrackJSCapturePayload } from "./types";
import { Agent } from "./Agent";
import {
  expressRequestHandler,
  expressErrorHandler,
  expressMiddleware,
  expressErrorMiddleware
} from "./handlers/express";
import { ConsoleTelemetry } from "./telemetry";
import { AgentRegistrar } from "./AgentRegistrar";
import { ConsoleWatcher, ExceptionWatcher, RejectionWatcher, Watcher, NetworkWatcher } from "./watchers";
import { isError } from "./utils/isType";
import { serialize } from "./utils/serialize";
import { captureFault } from "./Fault";
import { TrackJSEntry } from "./types/TrackJSCapturePayload";

let watchers: Array<Watcher> = [ConsoleWatcher, ExceptionWatcher, NetworkWatcher, RejectionWatcher];
let hasInstalled: boolean = false;

/**
 * Whether the agent has been installed into the current environment
 *
 * @returns {boolean}
 */
export function isInstalled(): boolean {
  return hasInstalled;
}

/**
 * Install the agent into the current environment.
 *
 * @param options Installation Options.
 */
export function install(options: TrackJSInstallOptions): void {
  if (hasInstalled) {
    throw new TrackJSError("already installed.");
  }
  if (!options) {
    throw new TrackJSError("install options are required.");
  }
  if (!options.token) {
    throw new TrackJSError("install token is required.");
  }

  try {
    const agent = new Agent(options);
    AgentRegistrar.init(agent);
    for (const watcher of watchers) {
      watcher.install(agent.options);
    }
    agent.captureUsage();
    hasInstalled = true;
  } catch (error) {
    captureFault(error);
    throw new TrackJSError("error occurred during installation.", error);
  }
}

/**
 * Remove the agent from the current environment.
 */
export function uninstall(): void {
  if (!hasInstalled) {
    return;
  }

  try {
    watchers.forEach((w) => w.uninstall());
    AgentRegistrar.close();
    hasInstalled = false;
  } catch (error) {
    captureFault(error);
    throw new TrackJSError("error occurred during uninstall.", error);
  }
}

/**
 * Update the current agent options from previously installed values.
 *
 * @param options Options to be updated.
 */
export function configure(options: TrackJSOptions): void {
  if (!hasInstalled) {
    throw new TrackJSError("not installed.");
  }
  AgentRegistrar.getCurrentAgent().configure(options);
}

/**
 * Add a key-value pair of strings to metadata.
 * Or add a Dictionary Object of key-value pairs to metadata.
 *
 * @param meta {String|Dictionary} key to add, or Dictionary Object.
 * @param value {String} value to add.
 * @example
 *   metadata.add('foo', 'bar')
 *   metadata.add({ 'foo': 'bar', 'bar': 'baz' })
 */
export function addMetadata(meta: string | { [key: string]: string }, value?: string): void {
  if (!hasInstalled) {
    throw new TrackJSError("not installed.");
  }
  AgentRegistrar.getCurrentAgent().metadata.add(meta, value);
}

/**
 * Remove a key from metadata.
 * Or remove a Dictionary Object of keys from metadata. The values in the
 * dictionary do not matter.
 *
 * @param meta {String|Dictionary} key to add, or Dictionary Object.
 * @example
 *   metadata.remove('foo')
 *   metadata.remove({ 'foo': '', 'bar': '' })
 */
export function removeMetadata(meta: string | { [key: string]: string }): void {
  if (!hasInstalled) {
    throw new TrackJSError("not installed.");
  }
  AgentRegistrar.getCurrentAgent().metadata.remove(meta);
}

/**
 * Add a message to the Telemetry log.
 *
 * @param severity {String} "log","debug","info","warn","error"
 * @param messages Any messages to be added to the log
 */
export function addLogTelemetry(severity: string, ...messages: any): void {
  if (!hasInstalled) {
    throw new TrackJSError("not installed.");
  }
  AgentRegistrar.getCurrentAgent().telemetry.add("c", new ConsoleTelemetry(severity, messages));
}

/**
 * For parity with the browser agent, add a set of helper functions that resembles the
 * console object hanging off TrackJS.
 */
export const console = {
  log: (...messages: any): void => addLogTelemetry("log", ...messages),
  info: (...messages: any): void => addLogTelemetry("info", ...messages),
  debug: (...messages: any): void => addLogTelemetry("debug", ...messages),
  warn: (...messages: any): void => addLogTelemetry("warn", ...messages),
  error: (...messages: any): void => {
    if (!hasInstalled) {
      throw new TrackJSError("not installed.");
    }
    let error = isError(messages) ? messages : new Error(serialize(messages));
    AgentRegistrar.getCurrentAgent().captureError(error, TrackJSEntry.Console);
  }
};

/**
 * Attach a event handler to Errors. Event handlers will be called in order
 * they were attached.
 *
 * @param func {Function} Event handler that accepts a `TrackJSCapturePayload`.
 * Returning `false` from the handler will cause the Error to be ignored.
 * @example
 *   TrackJS.onError((payload) => {
 *     return (payload.message.indexOf('NSA') >= 0)
 *   })
 */
export function onError(func: (payload: TrackJSCapturePayload) => boolean): void {
  if (!hasInstalled) {
    throw new TrackJSError("not installed.");
  }
  AgentRegistrar.getCurrentAgent().onError(func);
}

/**
 * Sends a usage beacon for tracking error rates.
 */
export function usage(): void {
  if (!hasInstalled) {
    throw new TrackJSError("not installed.");
  }
  AgentRegistrar.getCurrentAgent().captureUsage();
}

/**
 * Track error data.
 *
 * @param data {*} Data to be tracked to the TrackJS service.
 * @param options {TrackJSOptions} Override the installation settings.
 * @returns {Error} passed or generated error object.
 */
export function track(data: any, options?: TrackJSOptions): Error {
  if (!hasInstalled) {
    throw new TrackJSError("not installed.");
  }
  let error = isError(data) ? data : new Error(serialize(data));

  // The user wants to do a one-off track() that overrides agent options
  if (options) {
    AgentRegistrar.getCurrentAgent()
      .clone(options)
      .captureError(error, TrackJSEntry.Direct);
  } else {
    AgentRegistrar.getCurrentAgent().captureError(error, TrackJSEntry.Direct);
  }

  return error;
}

export const Handlers = {
  /**
   * Returns an ExpressJS Error Handler that captures errors from processing.
   * Should be the *last* handler in the application.
   *
   * @example
   * let app = express()
   *   .use({ all other handlers })
   *   .use(TrackJS.expressErrorHandler())
   *   .listen()
   */
  expressErrorHandler(): expressErrorMiddleware {
    if (!hasInstalled) {
      throw new TrackJSError("not installed.");
    }
    return expressErrorHandler();
  },

  /**
   * Returns an ExpressJS Request Handler that configures an agent to handle
   * events during the request. This should be the *first* handler in the series.
   *
   * @example
   * let app = express()
   *   .use(TrackJS.expressRequestHandler())
   *   .use({ all other handlers })
   *   .listen()
   */
  expressRequestHandler(): expressMiddleware {
    if (!hasInstalled) {
      throw new TrackJSError("not installed.");
    }
    return expressRequestHandler();
  }
};
