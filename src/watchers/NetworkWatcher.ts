import http from "http";
import https from "https";
import { patch, unpatch } from "../utils/patch";
import { NetworkTelemetry } from "../telemetry";
import { AgentRegistrar } from "../AgentRegistrar";
import { Watcher } from "./Watcher";
import { TrackJSEntry } from "../types/TrackJSCapturePayload";
import { TrackJSOptions } from "../types";

class _NetworkWatcher implements Watcher {

  private options: TrackJSOptions;

  /**
   * @inheritdoc
   */
  install(options: TrackJSOptions): void {
    this.options = options;

    if (!this.options.network.enabled) {
      return;
    }

    const networkWatcher = this;
    for(const module of [http, https]) {
      for (const method of ["request", "get"]) {
        patch(module, method, (original) => {
          return function request(options) {
            const req = original.apply(this, arguments);

            if (!options?.__trackjs__)  {
              const networkTelemetry = networkWatcher.createTelemetryFromRequest(req);
              AgentRegistrar.getCurrentAgent(req.domain).telemetry.add("n", networkTelemetry);
            }

            return req;
          }
        })
      }
    }
  }

  /**
   * @inheritdoc
   */
  uninstall(): void {
    for(const module of [http, https]) {
      for (const method of ["request", "get"]) {
        unpatch(module, method);
      }
    }
  }

  createTelemetryFromRequest(request: http.ClientRequest): NetworkTelemetry {
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

      if (this.options.network.error && networkTelemetry.statusCode >= 400) {
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
