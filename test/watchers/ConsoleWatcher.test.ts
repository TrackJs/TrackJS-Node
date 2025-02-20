import { ConsoleWatcher } from "../../src/watchers";
import { ConsoleTelemetry } from "../../src/telemetry";
import { Agent } from "../../src/Agent";
import { AgentRegistrar } from "../../src/AgentRegistrar";

let _ConsoleWatcher = ConsoleWatcher as any;

beforeAll(() => {
  Agent.defaults.dependencies = false;
});

describe("ConsoleWatcher", () => {
  describe("install()", () => {
    let fakeOptions = null;
    let fakeConsole = null;
    let fakeAgent = null;

    beforeEach(() => {
      fakeOptions = {};
      fakeConsole = jest.mock("console");
      fakeAgent = new Agent({ token: "test" });
      AgentRegistrar.init(fakeAgent);
    });

    afterEach(() => {
      AgentRegistrar.close();
    });

    it("console patches add telemetry", () => {
      fakeAgent.telemetry.add = jest.fn();
      _ConsoleWatcher.install(fakeOptions, fakeConsole);
      fakeConsole.log("a log message");
      expect(fakeAgent.telemetry.add).toHaveBeenCalledWith("c", expect.any(ConsoleTelemetry));
    });

    it("calls through to console", () => {
      let consoleLogSpy = jest.spyOn(fakeConsole, "log");
      _ConsoleWatcher.install(fakeOptions, fakeConsole);
      fakeConsole.log("a log message", 2, 3, 4);
      expect(consoleLogSpy).toHaveBeenCalledWith("a log message", 2, 3, 4);
    });

    it("captures on console error", () => {
      fakeAgent.captureError = jest.fn((error) => null);
      _ConsoleWatcher.install(fakeOptions, fakeConsole);
      fakeConsole.error("oops");
      expect(fakeAgent.captureError).toHaveBeenCalled();
    });
  });
});
