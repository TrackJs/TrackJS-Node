import domain from "domain";
import { AgentRegistrar } from "../AgentRegistrar";
import { uuid } from "../utils/uuid";
import { EventEmitter } from "events";
import { TrackJSEntry } from "../types/TrackJSCapturePayload";

export type expressMiddleware = (req: any, res: any, next: (error?: any) => void) => void;

export type expressErrorMiddleware = (error: Error, req: any, res: any, next: (error?: any) => void) => void;

function getStatusCode(error) {
  const statusCode = error.status || error.statusCode || error.status_code || (error.output && error.output.statusCode);
  return statusCode ? parseInt(statusCode, 10) : 500;
}

/**
 * Returns an ExpressJS Request Handler that configures an agent to handle
 * events during the request. This should be the *first* handler in the series.
 *
 * @example
 * let app = express()
 *   .use(TrackJS.expressRequestHandler())
 *   .use({ all other handlers })
 *   .listen()
 */
export function expressRequestHandler(): expressMiddleware {
  return function trackjsExpressRequestHandler(req, res, next) {
    // Creating a NodeJS Error domain for this request, which will allow the
    // `AgentRegistrar` the ability to create child agents specific to the
    // activities of this request.
    const requestDomain = domain.create();

    // Adding the req/res as handlers for domain events. This allows the
    // normal error handlers to manage the domain error event as well.
    requestDomain.add(req as EventEmitter);
    requestDomain.add(res as EventEmitter);
    requestDomain.on("error", next);

    // execute the remaining middleware within the context of this domain.
    requestDomain.run(() => {
      let agent = AgentRegistrar.getCurrentAgent();
      agent.configure({ correlationId: uuid() }); // correlate all errors from this request together.
      agent.environment.start = new Date();
      agent.environment.referrerUrl = req["headers"]["referer"] || "";
      agent.environment.url = `${req["protocol"]}://${req["get"]("host")}${req["originalUrl"]}`;
      agent.metadata.add("__TRACKJS_REQUEST_USER_AGENT", req["headers"]["user-agent"]);
      next();
    });
  };
}

/**
 * Returns an ExpressJS Error Handler that captures errors from processing.
 * Should be the *last* handler in the application.
 *
 * @param options.next {Boolean} True if you want the error passed through to the
 * next handler. Default false.
 * @example
 * let app = express()
 *   .use({ all other handlers })
 *   .use(TrackJS.expressErrorHandler({ next: false })) // true if you want to have your own handler after
 *   .listen()
 */
export function expressErrorHandler(options: { next: boolean } = { next: false }): expressErrorMiddleware {
  return function trackjsExpressErrorHandler(error, req, res, next) {
    if (error && !error["__trackjs__"]) {
      var statusCode = getStatusCode(error);
      if (statusCode < 500) {
        next();
        return;
      }
      AgentRegistrar.getCurrentAgent().captureError(error, TrackJSEntry.Express);
    }
    if (options.next) {
      next(error);
    }
  };
}
