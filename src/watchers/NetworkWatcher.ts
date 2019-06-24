import http from "http";
import { patch, unpatch } from "../utils/patch";
import { NetworkTelemetry } from "../telemetry";
import { AgentRegistrar } from "../AgentRegistrar";
import { Watcher } from "./Watcher";
const HttpAgent = require("_http_agent");

class _NetworkWatcher implements Watcher {
  /**
   * @inheritdoc
   * @param _agent {http.Agent} override of the global http agent.
   */
  install(_agent?: any): void {
    let agentPrototype = _agent ? _agent.prototype : HttpAgent.Agent.prototype;
    patch(agentPrototype, "addRequest", originalAddRequest => {
      return function addRequest(req, options, port, localAddress) {
        if (!(options || {})["__trackjs__"]) {
          let networkTelemetry = _NetworkWatcher.createTelemetryFromRequest(
            req
          );
          AgentRegistrar.getCurrentAgent(req["domain"]).telemetry.add(
            "n",
            networkTelemetry
          );
        }

        return originalAddRequest.apply(this, arguments);
      };
    });
  }

  /**
   * @inheritdoc
   * @param _agent {http.Agent} override of the global http agent.
   */
  uninstall(_agent?: any): void {
    let agentPrototype = _agent ? _agent.prototype : HttpAgent.Agent.prototype;
    unpatch(agentPrototype, "addRequest");
  }

  static createTelemetryFromRequest(
    request: http.ClientRequest
  ): NetworkTelemetry {
    let networkTelemetry = new NetworkTelemetry();
    networkTelemetry.startedOn = new Date().toISOString();
    networkTelemetry.method = request["method"];
    networkTelemetry.url = `${request["agent"].protocol}//${request.getHeader(
      "host"
    )}${request.path}`;

    request.once("socket", () => {
      networkTelemetry.startedOn = new Date().toISOString();
    });

    request.once("response", (response: http.IncomingMessage) => {
      networkTelemetry.statusCode = response.statusCode;
      networkTelemetry.statusText = response.statusMessage;
      networkTelemetry.completedOn = new Date().toISOString();

      if (networkTelemetry.statusCode >= 400) {
        AgentRegistrar.getCurrentAgent(request["domain"]).captureError(
          new Error(
            `${networkTelemetry.statusCode} ${networkTelemetry.statusText}: ${networkTelemetry.method} ${networkTelemetry.url}`
          )
        );
      }
    });

    return networkTelemetry;
  }
}

/**
 * Watches http/s requests for logs.
 * Singleton.
 */
export const NetworkWatcher = new _NetworkWatcher() as Watcher;
