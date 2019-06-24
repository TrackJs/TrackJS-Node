import { TrackJSCapturePayload, TrackJSInstallOptions, TrackJSOptions, TrackJSConsole, TrackJSNetwork } from "./types";
import { isFunction } from "./utils/isType";
import { TelemetryBuffer, ConsoleTelemetry } from "./telemetry";
import { Metadata } from "./Metadata";
import { Environment } from "./Environment";
import { transmit } from "./Transmitter";
import { deduplicate, truncate } from "./agentHelpers";
import { uuid } from "./utils/uuid";
import { RELEASE_VERSION } from "./version";

export class Agent {
  static defaults: TrackJSOptions = {
    token: "",
    application: "",
    captureURL: "https://capture.trackjs.com/capture",
    correlationId: "",
    dependencies: true,
    faultUrl: "https://usage.trackjs.com/fault.gif",
    sessionId: "",
    usageURL: "https://usage.trackjs.com/usage.gif",
    userId: "",
    version: ""
  };

  environment = new Environment();
  metadata = new Metadata();
  options: TrackJSOptions;
  telemetry = new TelemetryBuffer(30);

  private _onErrorFns = [];

  constructor(options: TrackJSInstallOptions) {
    this.options = Object.assign({}, Agent.defaults, options);

    if (this.options.dependencies) {
      this.environment.discoverDependencies();
    }

    this.options.correlationId = this.options.correlationId || uuid();

    if (isFunction(options.onError)) {
      this.onError(options.onError);
      delete this.options.onError;
    }

    this.metadata = new Metadata(this.options.metadata);
    delete this.options.metadata;
  }

  /**
   * Capture an error report.
   *
   * @param error {Error} Error to be captured to the TrackJS Service.
   * @returns {Boolean} `false` if the error was ignored.
   */
  captureError(error: Error): boolean {
    // bail out if we've already captured this error instance on another path.
    if (error["__trackjs__"]) {
      return false;
    }
    Object.defineProperty(error, "__trackjs__", {
      value: true,
      enumerable: false
    });

    let report = this.createErrorReport(error);
    let hasIgnored = false;

    [deduplicate, truncate, ...this._onErrorFns].forEach((fn) => {
      if (!hasIgnored) {
        try {
          hasIgnored = !fn(report);
        } catch (e) {
          // Error in user-provided callback. We want to proceed, but notify them
          // that their code has failed.
          report.console.push({
            severity: "error",
            message: "Your TrackJS Callback failed with Error: " + e.message,
            timestamp: new Date().toISOString()
          });
        }
      }
    });
    if (hasIgnored) {
      return false;
    }

    // Adding a record of this error to telemetry so that future errors have
    // an easy reference.
    // TODO replace with a better telemetry type
    this.telemetry.add("c", new ConsoleTelemetry("error", [error]));

    transmit({
      url: this.options.captureURL,
      method: "POST",
      queryParams: {
        token: this.options.token,
        v: RELEASE_VERSION
      },
      payload: report
    });
    return true;
  }

  /**
   * Capture a usage record.
   */
  captureUsage(): void {
    transmit({
      url: this.options.usageURL,
      method: "GET",
      queryParams: {
        token: this.options.token,
        correlationId: this.options.correlationId,
        application: this.options.application
      }
    });
  }

  /**
   * Creates a copy of the current agent and the contextual logs and event
   * handlers. This allows for cloned objects to be later modified independently
   * of the parent.
   *
   * @param options {TrackJSOptions} Override the installation settings.
   */
  clone(options?: TrackJSOptions): Agent {
    let cloned = new Agent(Object.assign({}, this.options, options) as TrackJSInstallOptions);
    cloned.metadata = this.metadata.clone();
    cloned.telemetry = this.telemetry.clone();
    cloned.environment = this.environment.clone();
    this._onErrorFns.forEach((fn) => cloned.onError(fn));

    if (options && options.metadata) {
      cloned.metadata.add(options.metadata);
    }

    return cloned;
  }

  /**
   * Update the agent configuration options.
   *
   * @param options Option values to be updated.
   */
  configure(options: TrackJSOptions) {
    this.options = Object.assign(this.options, options);
  }

  /**
   * Generate a full error report payload for a given error with the context logs
   * gathered by this agent.
   *
   * @param error {Error} Error to base for the report.
   */
  createErrorReport(error: Error): TrackJSCapturePayload {
    let now = new Date();
    return {
      bindStack: null,
      bindTime: null,
      console: this.telemetry.getAllByCategory("c") as Array<TrackJSConsole>,
      customer: {
        application: this.options.application,
        correlationId: this.options.correlationId,
        sessionId: this.options.sessionId,
        token: this.options.token,
        userId: this.options.userId,
        version: this.options.version
      },
      entry: "server",
      environment: {
        age: now.getTime() - this.environment.start.getTime(),
        dependencies: this.environment.getDependencies(),
        originalUrl: this.environment.url,
        referrer: this.environment.referrerUrl,
        userAgent: this.environment.userAgent,
        viewportHeight: 0,
        viewportWidth: 0
      },
      file: "",
      message: error.message,
      metadata: this.metadata.get(),
      nav: [],
      network: this.telemetry.getAllByCategory("n") as Array<TrackJSNetwork>,
      url: this.environment.url,
      stack: error.stack,
      throttled: 0,
      timestamp: now.toISOString(),
      visitor: [],
      version: RELEASE_VERSION
    };
  }

  /**
   * Attach a event handler to Errors. Event handlers will be called in order
   * they were attached.
   *
   * @param func {Function} Event handler that accepts a `TrackJSCapturePayload`.
   * Returning `false` from the handler will cause the Error to be ignored.
   */
  onError(func: (payload: TrackJSCapturePayload) => boolean): void {
    this._onErrorFns.push(func);
  }
}
