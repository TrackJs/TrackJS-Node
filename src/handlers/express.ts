import domain from 'domain';
import http from 'http';
import { AgentRegistrar } from '../AgentRegistrar';
import { uuid } from '../utils/uuid';

type expressMiddleware = (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => void;
type expressErrorHandler = (error: Error, req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => void;

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
    requestDomain.add(req);
    requestDomain.add(res);
    requestDomain.on('error', next);

    // execute the remaining middleware within the context of this domain.
    requestDomain.run(() => {
      let agent = AgentRegistrar.getCurrentAgent();
      agent.configure({ correlationId: uuid() }); // correlate all errors from this request together.
      agent.environment.start = new Date();
      agent.environment.referrerUrl = req.headers['referer'] || '';
      agent.environment.url = req.url;
      agent.captureUsage();
      next();
    })
  };
}

/**
 * Returns an ExpressJS Error Handler that captures errors from processing.
 * Should be the *last* handler in the application.
 *
 * @example
 * let app = express()
 *   .use({ all other handlers })
 *   .use(TrackJS.expressErrorHandler())
 *   .listen()
 */
export function expressErrorHandler(): expressErrorHandler {
  return function trackjsExpressErrorHandler(error, req, res, next) {
    if (error && !error['__trackjs__']) {
      var statusCode = getStatusCode(error);
      if (statusCode < 500) {
        next();
        return;
      }
      AgentRegistrar.getCurrentAgent().captureError(error);
      Object.defineProperty(error, '__trackjs__', { value: true, enumerable: false });
    }
    next(error);
  }
}
