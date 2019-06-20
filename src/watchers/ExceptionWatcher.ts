import { AgentRegistrar } from '../AgentRegistrar';
import { Watcher } from '.';

class _ExceptionWatcher implements Watcher {

  install(): void {
    global.process.on('uncaughtException', this._handler);
  }

  uninstall(): void {
    global.process.off('uncaughtException', this._handler);
  }

  private _handler(error: Error): void {
    AgentRegistrar.getCurrentAgent().captureError(error);
  }

}

export const ExceptionWatcher = new _ExceptionWatcher() as Watcher;
