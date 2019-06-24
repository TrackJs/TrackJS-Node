import { AgentRegistrar } from "../AgentRegistrar";
import { Watcher } from ".";

class _ExceptionWatcher implements Watcher {
  /**
   * @inheritdoc
   */
  install(): void {
    process.on("uncaughtException", this.handleException);
  }

  /**
   * @inheritdoc
   */
  uninstall(): void {
    process.off("uncaughtException", this.handleException);
  }

  handleException(error: Error): void {
    AgentRegistrar.getCurrentAgent().captureError(error);
  }
}

/**
 * Watches for Global Uncaught Exceptions.
 * Singleton.
 */
export const ExceptionWatcher = new _ExceptionWatcher() as Watcher;
