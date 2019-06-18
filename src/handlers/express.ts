import Agent from "../Agent";

function getStatusCode(error) {
  const statusCode = error.status || error.statusCode || error.status_code || (error.output && error.output.statusCode);
  return statusCode ? parseInt(statusCode, 10) : 500;
}

export function expressErrorHandler(agent: Agent): Function {
  return function(error, req, res, next) {
    var statusCode = getStatusCode(error);
    if (statusCode < 500) {
      next();
      return;
    }
    agent.captureError(error);
    next(error);
  }
}