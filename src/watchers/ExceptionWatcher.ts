import Agent from '../Agent';

export class ExceptionWatcher {

  private _agent: Agent;

  constructor(agent: Agent) {
    this._agent = agent;
    this._handler = this._handler.bind(this);
  }

  install(): void {
    global.process.on('uncaughtException', this._handler);
  }

  uninstall(): void {
    global.process.off('uncaughtException', this._handler);
  }

  private _handler(error: Error): void {
    this._agent.captureError(error);
  }

}
