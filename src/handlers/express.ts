import { AgentRegistrar } from '../AgentRegistrar';

function getStatusCode(error) {
  const statusCode = error.status || error.statusCode || error.status_code || (error.output && error.output.statusCode);
  return statusCode ? parseInt(statusCode, 10) : 500;
}

export function expressErrorHandler(): Function {
  return function(error, req, res, next) {
    var statusCode = getStatusCode(error);
    if (statusCode < 500) {
      next();
      return;
    }
    AgentRegistrar.getCurrentAgent().captureError(error);
    next(error);
  }
}