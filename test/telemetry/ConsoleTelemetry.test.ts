import { ConsoleTelemetry } from "../../src/telemetry";

describe("ConsoleTelemetryData", () => {
  describe("normalizeSeverity()", () => {
    test("it returns supported values", () => {
      expect.assertions(5);
      ["debug", "info", "warn", "error", "log"].forEach((sev) => {
        expect(ConsoleTelemetry.normalizeSeverity(sev)).toBe(sev);
      });
    });

    test("it normalizes casing", () => {
      expect(ConsoleTelemetry.normalizeSeverity("DEBUG")).toBe("debug");
      expect(ConsoleTelemetry.normalizeSeverity("eRrOr")).toBe("error");
      expect(ConsoleTelemetry.normalizeSeverity("loG")).toBe("log");
    });

    test("it returns default for unsupported", () => {
      expect.assertions(5);
      ["", "custom", "a really really really long value", "something else", "false"].forEach((sev) => {
        expect(ConsoleTelemetry.normalizeSeverity(sev)).toBe("log");
      });
    });
  });

  describe("constructor()", () => {
    test("it handles weird message formats", () => {
      expect(new ConsoleTelemetry("log", ["a message"]).message).toBe("a message");
      expect(new ConsoleTelemetry("log", [1, 2, 3, 4, 5]).message).toBe("[1,2,3,4,5]");
      expect(new ConsoleTelemetry("log", [{ foo: "bar" }]).message).toBe('{"foo":"bar"}');
      expect(new ConsoleTelemetry("log", [{ foo: "bar" }, { bar: "baz" }]).message).toBe(
        '[{"foo":"bar"},{"bar":"baz"}]'
      );
    });
  });
});
