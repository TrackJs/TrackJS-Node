import {
  TrackJS,
  TrackJSCapturePayload,
  TrackJSError,
  TrackJSOptions
} from '../src/index';

describe('TrackJS', () => {

  test('api exists', () => {
    expect(TrackJS.install).toEqual(expect.any(Function));
    expect(TrackJS.uninstall).toEqual(expect.any(Function));
    expect(TrackJS.addMetadata).toEqual(expect.any(Function));
    expect(TrackJS.removeMetadata).toEqual(expect.any(Function));
    expect(TrackJS.addLogTelemetry).toEqual(expect.any(Function));
    expect(TrackJS.onError).toEqual(expect.any(Function));
    expect(TrackJS.track).toEqual(expect.any(Function));

    expect(TrackJS.Handlers.expressErrorHandler).toEqual(expect.any(Function));

    expect(TrackJSError).toBeTruthy();
  });

});
