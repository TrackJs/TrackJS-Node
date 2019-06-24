import { serialize } from "../utils/serialize";
import { TrackJSConsole } from "../types";

export class ConsoleTelemetry implements TrackJSConsole {
  message: string;
  severity: string;
  timestamp: string;

  constructor(severity: string, messages: Array<any>) {
    this.severity = ConsoleTelemetry.normalizeSeverity(severity);
    this.message = serialize(messages.length === 1 ? messages[0] : messages);
    this.timestamp = new Date().toISOString();
  }

  static normalizeSeverity(severity: string): string {
    severity = severity.toLowerCase();
    if (["debug", "info", "warn", "error", "log"].indexOf(severity) < 0) {
      return "log";
    }
    return severity;
  }
}
