import http from "http";
import https from "https";
import { NetworkWatcher } from "../../src/watchers";
import { Agent } from "../../src/Agent";
import { AgentRegistrar } from "../../src/AgentRegistrar";

let _NetworkWatcher = NetworkWatcher as any;

beforeAll(() => {
  Agent.defaults.dependencies = false;
});

jest.mock("net");

describe("NetworkWatcher", () => {
  describe("install()", () => {
    let fakeAgent = null;

    beforeEach(() => {
      fakeAgent = new Agent({ token: "test" });
      AgentRegistrar.init(fakeAgent);
    });

    afterEach(() => {
      NetworkWatcher.uninstall();
    });

    it("http patched to intercept request", () => {
      fakeAgent.telemetry.add = jest.fn();
      _NetworkWatcher.install();
      http.get("http://example.com/?foo=bar", (response) => {});
      expect(fakeAgent.telemetry.add).toHaveBeenCalledWith(
        "n",
        expect.objectContaining({
          method: "GET",
          url: "http://example.com/?foo=bar",
          startedOn: expect.any(String)
        })
      );
    });

    it("https patched to intercept request", () => {
      fakeAgent.telemetry.add = jest.fn();
      _NetworkWatcher.install();
      https.get("https://example.com/?foo=bar");
      expect(fakeAgent.telemetry.add).toHaveBeenCalledWith(
        "n",
        expect.objectContaining({
          method: "GET",
          url: "https://example.com/?foo=bar",
          startedOn: expect.any(String)
        })
      );
    });
  });
});
