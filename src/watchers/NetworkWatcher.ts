import http from "http";
import https from "https";
import { patch, unpatch } from "../utils/patch";
import { NetworkTelemetry } from "../telemetry";
import { AgentRegistrar } from "../AgentRegistrar";
import { Watcher } from "./Watcher";
import { TrackJSEntry } from "../types/TrackJSCapturePayload";

class _NetworkWatcher implements Watcher {
  /**
   * @inheritdoc
   */
  install(): void {
    [http, https].forEach((module) => {
      patch(module, "request", (original) => {
        return function request(outgoing) {
          let req = original.apply(this, arguments)

          if (!(outgoing || {})["__trackjs__"]) {
            let networkTelemetry = _NetworkWatcher.createTelemetryFromRequest(req);
            AgentRegistrar.getCurrentAgent(req["domain"]).telemetry.add("n", networkTelemetry);
          }

          return req;
        }
      });
    });
  }

  /**
   * @inheritdoc
   */
  uninstall(): void {
    [http, https].forEach((module) => {
      unpatch(module, "request");
    });
  }

  static createTelemetryFromRequest(request: http.ClientRequest): NetworkTelemetry {
    let networkTelemetry = new NetworkTelemetry();
    networkTelemetry.type = "http";
    networkTelemetry.startedOn = new Date().toISOString();
    networkTelemetry.method = request["method"];
    networkTelemetry.url = `${request["agent"].protocol}//${request.getHeader("host")}${request.path}`;

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
          ),
          TrackJSEntry.Network
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
