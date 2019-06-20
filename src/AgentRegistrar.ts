/**
 *
 */

import { Agent } from "./Agent";

class _AgentRegistrar {

  private _masterAgent: Agent;
  private _registry;

  init(masterAgent: Agent): void {
    this._masterAgent = masterAgent;
  }

  getCurrentAgent(): Agent {
    return this._masterAgent;
  }

  clear(): void {
    // TODO
  }

}

export const AgentRegistrar = new _AgentRegistrar();
