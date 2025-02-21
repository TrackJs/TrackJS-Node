import { AgentRegistrar } from "../AgentRegistrar";
import { Watcher } from ".";
import { TrackJSEntry } from "../types/TrackJSCapturePayload";
import { TrackJSOptions } from "../types";

class _ExceptionWatcher implements Watcher {
  /**
   * @inheritdoc
   */
  install(options: TrackJSOptions): void {
    process.on("uncaughtException", this.handleException);
  }

  /**
   * @inheritdoc
   */
  uninstall(): void {
    process.off("uncaughtException", this.handleException);
  }

  handleException(error: Error): void {
    AgentRegistrar.getCurrentAgent().captureError(error, TrackJSEntry.Global);
  }
}

/**
 * Watches for Global Uncaught Exceptions.
 * Singleton.
 */
export const ExceptionWatcher = new _ExceptionWatcher() as Watcher;
