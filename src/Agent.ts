import { TrackJSOptions } from "./interfaces/TrackJSOptions";

export class Agent {

  static defaults:TrackJSOptions = {
    token: '',
    application: '',
    sessionId: '',
    userId: '',
    version: ''
  }

  options:TrackJSOptions = null
  telemetry = []

  constructor(options: TrackJSOptions) {
    this.options = Object.assign({}, Agent.defaults, options);
  }

  addTelemetry(type: string, data: any): string {
    this.telemetry.push({
      id: 'id',
      type,
      data
    })
    return 'id';
  }

}
