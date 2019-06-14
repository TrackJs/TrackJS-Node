export class TrackJSError extends Error {
  constructor(_message: string) {
    _message = 'TrackJS: ' + _message + ' . See https://docs.trackjs.com/';
    super(_message);
    Object.setPrototypeOf(this, TrackJSError.prototype);
  }
}
