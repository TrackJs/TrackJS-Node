import os from "os";
import { Agent } from "../src/Agent";
import { ConsoleTelemetry } from "../src/telemetry";
import { transmit } from "../src/Transmitter";
import { TrackJSEntry } from "../src/types/TrackJSCapturePayload";

jest.mock("../src/Transmitter");

describe("Agent", () => {
  describe("constructor()", () => {
    it("initializes with options", () => {
      let options = {
        token: "token",
        application: "application",
        correlationId: "correlation",
        defaultMetadata: false,
        dependencies: false,
        errorURL: "https://mycapture.com/",
        faultURL: "https://myfault.com/",
        network: {
          error: true,
          enabled: false
        },
        sessionId: "session",
        usageURL: "https://myusage.com/",
        userId: "user",
        version: "version"
      };
      let context = new Agent(options);
      expect(context.options).toEqual(options);
    });

    it("initializes with default options", () => {
      const options = {
        token: "token"
      };
      const agent = new Agent(options);
      expect(agent.options).toEqual({
        token: "token",
        application: "",
        faultURL: "https://usage.trackjs.com/fault.gif",
        errorURL: "https://capture.trackjs.com/capture/node",
        defaultMetadata: true,
        dependencies: true,
        network: {
          error: true,
          enabled: true
        },
        sessionId: "",
        usageURL: "https://usage.trackjs.com/usage.gif",
        userId: "",
        version: ""
      });
    });

    it("initializes metadata", () => {
      let agent = new Agent({ token: "test", defaultMetadata: false, metadata: { foo: "bar" } });
      expect(agent.metadata.get()).toEqual([{ key: "foo", value: "bar" }]);
    });

    it("initializes default metadata", () => {
      let agent = new Agent({ token: "test", defaultMetadata: true });
      expect(agent.metadata.get()).toEqual(
        expect.arrayContaining([
          { key: "hostname", value: os.hostname() },
          { key: "username", value: os.userInfo().username },
          { key: "cwd", value: process.cwd() }
        ])
      );
    });
  });

  describe("clone", () => {
    it("returns a different agent", () => {
      let agent1 = new Agent({ token: "test" });
      let agent2 = agent1.clone();
      expect(agent1).not.toBe(agent2);
    });
    it("has equal options", () => {
      let agent1 = new Agent({ token: "test" });
      let agent2 = agent1.clone();
      expect(agent1.options).toEqual(agent2.options);
      expect(agent1.options).not.toBe(agent2.options);
    });
    it("has equal meta", () => {
      let agent1 = new Agent({ token: "test" });
      agent1.metadata.add("foo", "bar");
      let agent2 = agent1.clone();
      expect(agent1.metadata.get()).toEqual(agent2.metadata.get());
    });
    it("has equal telemetry", () => {
      let agent1 = new Agent({ token: "test" });
      agent1.telemetry.add("t", new ConsoleTelemetry("log", ["message"]));
      let agent2 = agent1.clone();
      expect(agent1.telemetry.getAllByCategory("t")).toEqual(agent2.telemetry.getAllByCategory("t"));
    });
    it("has equal environment", () => {
      let agent1 = new Agent({ token: "test" });
      agent1.environment.url = "http://example.com";
      let agent2 = agent1.clone();
      expect(agent1.environment).toEqual(agent2.environment);
      expect(agent1.environment).not.toBe(agent2.environment);
    });
    it("has same event handlers", () => {
      let agent1 = new Agent({ token: "test" });
      let handler1 = jest.fn((payload) => true);
      let handler2 = jest.fn((payload) => false);
      agent1.onError(handler1);
      agent1.onError(handler2);
      let agent2 = agent1.clone();
      agent2.captureError(new Error("test"), TrackJSEntry.Direct);
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
    it("clones with options", () => {
      let agent1 = new Agent({ token: "test" });
      let agent2 = agent1.clone({ application: "app" });
      expect(agent2.options).toEqual(
        expect.objectContaining({
          token: "test",
          application: "app"
        })
      );
    });
    it("clones with metadata", () => {
      let agent1 = new Agent({ token: "test", defaultMetadata: false });
      let agent2 = agent1.clone({ metadata: { foo: "bar" } });
      expect(agent2.metadata.get()).toEqual([{ key: "foo", value: "bar" }]);
    });
  });

  describe("createErrorReport()", () => {
    it("adds environment properties to payloads", () => {
      let agent = new Agent({ token: "test" });
      agent.environment.start = new Date(new Date().getTime() - 1);
      agent.environment.url = "http://example.com/path?foo=bar";
      agent.environment.referrerUrl = "http://test.com/path?bar=baz";
      agent.environment.userAgent = "user agent";
      let report = agent.createErrorReport(new Error("test"), TrackJSEntry.Direct);
      expect(report).toEqual(
        expect.objectContaining({
          environment: expect.objectContaining({
            age: expect.any(Number),
            originalUrl: "http://example.com/path?foo=bar",
            referrer: "http://test.com/path?bar=baz",
            userAgent: "user agent"
          }),
          url: "http://example.com/path?foo=bar"
        })
      );
      expect(report.environment.age).toBeLessThan(5);
      expect(report.environment.age).toBeGreaterThanOrEqual(1);
    });

    it("adds metadata to payloads", () => {
      let agent = new Agent({ token: "test", defaultMetadata: false });
      agent.metadata.add("foo", "bar");
      let report = agent.createErrorReport(new Error("test"), TrackJSEntry.Direct);
      expect(report).toEqual(
        expect.objectContaining({
          metadata: [{ key: "foo", value: "bar" }]
        })
      );
    });

    it("adds console telemetry to payload", () => {
      let agent = new Agent({ token: "test" });
      agent.telemetry.add("c", new ConsoleTelemetry("log", ["a log message"]));
      agent.telemetry.add("c", new ConsoleTelemetry("warn", ["a warning", { foo: "bar" }]));
      let payload = agent.createErrorReport(new Error("test error"), TrackJSEntry.Direct);
      expect(payload.console).toEqual([
        {
          severity: "log",
          message: "a log message",
          timestamp: expect.any(String)
        },
        {
          severity: "warn",
          message: '["a warning",{"foo":"bar"}]',
          timestamp: expect.any(String)
        }
      ]);
    });
  });

  describe("onError", () => {
    it("receives error events", () => {
      let agent = new Agent({ token: "test " });
      expect.assertions(1);
      agent.onError((payload) => {
        expect(payload.message).toBe("test message");
        return false;
      });
      agent.captureError(new Error("test message"), TrackJSEntry.Direct);
    });

    it("can ignore error events", () => {
      let agent = new Agent({ token: "test " });
      expect.assertions(1);
      agent.onError((payload) => false);
      expect(agent.captureError(new Error("test message"), TrackJSEntry.Direct)).toBe(false);
    });

    it("handles multiple callbacks", () => {
      let agent = new Agent({ token: "test " });
      let cb1 = jest.fn(() => true);
      let cb2 = jest.fn(() => true);

      agent.onError(cb1);
      agent.onError(cb2);
      agent.captureError(new Error("test message"), TrackJSEntry.Direct);

      expect(cb1).toHaveBeenCalled();
      expect(cb2).toHaveBeenCalled();
    });

    it("stops callbacks once ignored", () => {
      let agent = new Agent({ token: "test " });
      let cb1 = jest.fn(() => true);
      let cb2 = jest.fn(() => false);
      let cb3 = jest.fn(() => true);

      agent.onError(cb1);
      agent.onError(cb2);
      agent.onError(cb3);
      agent.captureError(new Error("test message"), TrackJSEntry.Direct);

      expect(cb1).toHaveBeenCalled();
      expect(cb2).toHaveBeenCalled();
      expect(cb3).not.toHaveBeenCalled();
    });

    it("adds handler from constructor", () => {
      let handler = jest.fn((payload) => false);
      let options = {
        token: "token",
        onError: handler
      };
      let agent = new Agent(options);
      agent.captureError(new Error("test message"), TrackJSEntry.Direct);
      expect(handler).toHaveBeenCalled();
    });

    it("recovers from a handler that throws", () => {
      let handler = jest.fn((payload) => {
        throw new Error("oops");
      });
      let agent = new Agent({ token: "test" });
      agent.onError(handler);
      expect(agent.captureError(new Error("test"), TrackJSEntry.Direct)).toBe(true);
      expect(transmit).toHaveBeenCalled();
    });
  });
});
