import http from "http";
import https from "https";
import { NetworkWatcher, Watcher } from "../../src/watchers";
import { Agent } from "../../src/Agent";
import { AgentRegistrar } from "../../src/AgentRegistrar";

let _NetworkWatcher = NetworkWatcher as Watcher;

beforeAll(() => {
  Agent.defaults.dependencies = false;
});

jest.mock("net");

describe("NetworkWatcher", () => {
  describe("install()", () => {
    let fakeAgent: Agent;

    beforeEach(() => {
      fakeAgent = new Agent({ token: "test" });
      AgentRegistrar.init(fakeAgent);
      _NetworkWatcher.install();
    });

    afterEach(() => {
      _NetworkWatcher.uninstall();
    });

    it("http patched to intercept request", async () => {
      fakeAgent.telemetry.add = jest.fn();
      await http.request("http://example.com/?foo=bar");
      expect(fakeAgent.telemetry.add).toHaveBeenCalledWith(
        "n",
        expect.objectContaining({
          method: "GET",
          url: "http://example.com/?foo=bar",
          startedOn: expect.any(String)
        })
      );
    });

    it("https patched to intercept request", async () => {
      fakeAgent.telemetry.add = jest.fn();
      await https.request("https://example.com/?foo=bar");
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
