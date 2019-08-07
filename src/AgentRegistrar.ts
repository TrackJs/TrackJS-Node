import domain, { Domain } from "domain";
import { Agent } from "./Agent";

class _AgentRegistrar {
  private _primaryAgent: Agent;
  private _ref = Symbol("TrackJS Agent Registrar");

  init(primaryAgent: Agent): void {
    this._primaryAgent = primaryAgent;
  }

  /**
   * Finds or creates an agent for the current state. Looks for the current running
   * domain.
   *
   * @param activeDomain {Domain} Active Domain override.
   * @see https://nodejs.org/api/domain.html
   */
  getCurrentAgent(activeDomain?: Domain): Agent {
    activeDomain = activeDomain || domain["active"];
    if (!activeDomain) {
      return this._primaryAgent;
    }

    if (!activeDomain[this._ref]) {
      let domainAgent = this._primaryAgent.clone();
      activeDomain[this._ref] = domainAgent;
    }

    return activeDomain[this._ref];
  }

  close(): void {
    this._primaryAgent = null;
    /**
     * NOTE [Todd Gardner] We don't cleanup the "child" agents that have been
     * attached to domains, because we cannot hold a reference to them without
     * preventing GC. They will be disposed along with the domains they are
     * attached to.
     */
  }
}

/**
 * Singleton
 */
export const AgentRegistrar = new _AgentRegistrar();
