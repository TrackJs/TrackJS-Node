import * as TrackJS from "../src/sdk";
import { TrackJSError } from "../src/types/TrackJSError";
import { AgentRegistrar } from "../src/AgentRegistrar";

describe("sdk", () => {
  describe("error checking", () => {
    it("install throws without options", () => {
      expect(() => TrackJS.install(null)).toThrow(TrackJSError);
    });
    it("install throws without token", () => {
      expect(() => TrackJS.install({ token: "" })).toThrow(TrackJSError);
    });
    it("install throws if already installed", () => {
      expect(() => TrackJS.install({ token: "" })).toThrow(TrackJSError);
    });
    it("uninstall returns okay without install", () => {
      expect(() => TrackJS.uninstall()).not.toThrow();
    });
    it("addMetadata throws when not installed", () => {
      expect(() => TrackJS.addMetadata("foo", "bar")).toThrow(TrackJSError);
    });
    it("removeMetadata throws when not installed", () => {
      expect(() => TrackJS.addMetadata("foo", "bar")).toThrow(TrackJSError);
    });
    it("addLogTelemetry throws when not installed", () => {
      expect(() => TrackJS.addLogTelemetry("log", "test")).toThrow(TrackJSError);
    });
    it("onError throws when not installed", () => {
      expect(() => TrackJS.onError((payload) => false)).toThrow(TrackJSError);
    });
    it("Handlers.expressErrorHandler throws when not installed", () => {
      expect(() => TrackJS.Handlers.expressErrorHandler()).toThrow(TrackJSError);
    });
  });

  describe("track()", () => {
    it("serializes non error data", () => {
      let errorTracked: Error;
      TrackJS.install({ token: "test" });
      AgentRegistrar.getCurrentAgent().captureError = jest.fn((error) => {
        errorTracked = error;
        return true;
      });
      TrackJS.track("a string");
      expect(errorTracked.message).toEqual("a string");
      TrackJS.track(42);
      expect(errorTracked.message).toEqual("42");
      TrackJS.track({ foo: "bar" });
      expect(errorTracked.message).toEqual('{"foo":"bar"}');
    });
  });
});
