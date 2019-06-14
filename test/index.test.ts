import * as TrackJS from '../src/index';

describe('TrackJS', () => {

  test('api exists', () => {
    expect(TrackJS.install).toEqual(expect.any(Function));
    expect(TrackJS.addLogTelemetry).toEqual(expect.any(Function));
    expect(TrackJS.track).toEqual(expect.any(Function));

    expect(TrackJS.TrackJSError).toBeTruthy();
  });

});
