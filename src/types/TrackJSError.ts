export class TrackJSError extends Error {
  innerError: Error;

  constructor(_message: string, _innerError?: Error) {
    _message = "TrackJS: " + _message + " See https://docs.trackjs.com/";
    super(_message);
    this.innerError = _innerError;
    Object.setPrototypeOf(this, TrackJSError.prototype);
  }
}
