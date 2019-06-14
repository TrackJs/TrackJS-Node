import { TrackJSOptions } from "./types/TrackJSOptions";
import TelemetryBuffer from "./telemetry/TelemetryBuffer";

export default class Agent {

  static defaults:TrackJSOptions = {
    token: '',
    application: '',
    sessionId: '',
    userId: '',
    version: ''
  }

  options:TrackJSOptions
  telemetry:TelemetryBuffer

  constructor(options: TrackJSOptions) {
    this.options = Object.assign({}, Agent.defaults, options);
    this.telemetry = new TelemetryBuffer(30);
  }

}
