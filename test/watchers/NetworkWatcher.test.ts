import http from "http";
import https from "https";
import { NetworkWatcher, Watcher } from "../../src/watchers";
import { Agent } from "../../src/Agent";
import { AgentRegistrar } from "../../src/AgentRegistrar";
import { TrackJSOptions } from "../../src/types";
import { TrackJSEntry } from "../../src/types/TrackJSCapturePayload";

const _NetworkWatcher = NetworkWatcher as Watcher;

beforeAll(() => {
  Agent.defaults.dependencies = false;
});

jest.mock("net");

describe("NetworkWatcher", () => {
  describe("install()", () => {
    let fakeOptions: TrackJSOptions;
    let fakeAgent: Agent;

    beforeEach(() => {
      fakeOptions = { network: { error: true, enabled: true } };
      fakeAgent = new Agent({ token: "test" });
      AgentRegistrar.init(fakeAgent);
    });

    afterEach(() => {
      _NetworkWatcher.uninstall();
    });

    it("when disabled, does nothing", (done) => {
      _NetworkWatcher.install({ network: { enabled: false } });
      fakeAgent.telemetry.add = jest.fn();
      http.get("http://example.com/?foo=bar", () => {
        expect(fakeAgent.telemetry.add).not.toHaveBeenCalled();
        done();
      });
    });

    it("when enabled, http patched to intercept request", (done) => {
      _NetworkWatcher.install({ network: { enabled: true } });
      fakeAgent.telemetry.add = jest.fn();

      const req = http.request("http://example.com/?foo=bar", { method: "GET" }, (resp) => {
        expect(fakeAgent.telemetry.add).toHaveBeenCalledWith(
          "n",
          expect.objectContaining({
            method: "GET",
            url: "http://example.com/?foo=bar",
            startedOn: expect.any(String)
          })
        );
        done();
      });
      req.end();
    });

    it("when enabled, https patched to intercept request", (done) => {
      _NetworkWatcher.install(fakeOptions);
      fakeAgent.telemetry.add = jest.fn();
      const req = https.request("https://example.com/?foo=bar", { method: "GET" }, (res) => {
        expect(fakeAgent.telemetry.add).toHaveBeenCalledWith(
          "n",
          expect.objectContaining({
            method: "GET",
            url: "https://example.com/?foo=bar",
            startedOn: expect.any(String)
          })
        );
        done();
      });
      req.end();
    });

    it("when error enabled, captures error from failing request", (done) => {
      _NetworkWatcher.install({ network: { enabled: true, error: true }});
      fakeAgent.telemetry.add = jest.fn();
      fakeAgent.captureError = jest.fn();
      const req = https.request("https://httpstat.us/501", { method: "GET" }, (res) => {
        setTimeout(() => {
          expect(fakeAgent.captureError).toHaveBeenCalledWith(
            expect.objectContaining({
              stack: expect.any(String)
            }),
            TrackJSEntry.Network
          );
          done();
        });
      });
      req.end();
    });

    it("when error disabled, no errors captured", (done) => {
      _NetworkWatcher.install({ network: { enabled: true, error: false }});
      fakeAgent.telemetry.add = jest.fn();
      fakeAgent.captureError = jest.fn();
      const req = https.request("https://httpstat.us/501", { method: "GET" }, (res) => {
        setTimeout(() => {
          expect(fakeAgent.captureError).not.toHaveBeenCalled();
          done();
        });
      });
      req.end();
    });

  });
});
