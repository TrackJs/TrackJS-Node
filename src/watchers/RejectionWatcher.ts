import { AgentRegistrar } from "../AgentRegistrar";
import { Watcher } from ".";
import { isError } from "../utils/isType";
import { serialize } from "../utils/serialize";
import { TrackJSEntry } from "../types/TrackJSCapturePayload";

class _RejectionWatcher implements Watcher {
  /**
   * @inheritdoc
   */
  install(): void {
    process.on("unhandledRejection", this.rejectionHandler);
  }

  /**
   * @inheritdoc
   */
  uninstall(): void {
    process.off("unhandledRejection", this.rejectionHandler);
  }

  rejectionHandler(reason: any, promise: any): void {
    let error = isError(reason) ? reason : new Error(serialize(reason));
    let agent = AgentRegistrar.getCurrentAgent(promise && promise.domain);
    agent.captureError(error, TrackJSEntry.Promise);
  }
}

/**
 * Watches for Unhandled Promise Rejections.
 * Singleton.
 */
export const RejectionWatcher = new _RejectionWatcher() as Watcher;
