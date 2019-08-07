import { patch, unpatch } from "../utils/patch";
import { ConsoleTelemetry } from "../telemetry";
import { AgentRegistrar } from "../AgentRegistrar";
import { Watcher } from "./Watcher";
import { TrackJSEntry } from "../types/TrackJSCapturePayload";
import { isError } from "../utils/isType";

const CONSOLE_FN_NAMES = ["debug", "info", "warn", "error", "log"];

class _ConsoleWatcher implements Watcher {
  /**
   * @inheritdoc
   * @param _console {Object} override of the global console object.
   */
  install(_console?: Object): void {
    let consoleObj = _console || console;
    CONSOLE_FN_NAMES.forEach((name) => {
      patch(consoleObj, name, function(originalFn) {
        return function(...messages: any) {
          let agent = AgentRegistrar.getCurrentAgent();
          let data = new ConsoleTelemetry(name, messages);
          agent.telemetry.add("c", data);
          if (name === "error") {
            // When a framework duplicates an error out into `console.error`, we
            // don't want to mangle that to allow it to get managed by
            // deduplicate.
            if (messages.length === 1 && isError(messages[0])) {
              agent.captureError(messages[0], TrackJSEntry.Console);
            } else {
              agent.captureError(new Error(data.message), TrackJSEntry.Console);
            }
          }
          return originalFn.apply(consoleObj, arguments);
        };
      });
    });
  }

  /**
   * @inheritdoc
   * @param _console {Object} override of the global console object.
   */
  uninstall(_console?: Object): void {
    let consoleObj = _console || console;
    CONSOLE_FN_NAMES.forEach((name) => unpatch(consoleObj, name));
  }
}

/**
 * Watches the global Console for logs.
 * Singleton.
 */
export const ConsoleWatcher = new _ConsoleWatcher() as Watcher;
