import * as TrackJS from '../src/sdk';
import { TrackJSError } from '../src/types/TrackJSError';

describe('sdk', () => {
  afterEach(() => {
    TrackJS.uninstall();
  });

  describe('invalid install', () => {
    test('it throws without options', () => {
      expect(() => TrackJS.install(null)).toThrow(TrackJSError);
    })
    test('it throws without token', () => {
      expect(() => TrackJS.install({ token: '' })).toThrow(TrackJSError);
    });
    test('it throws if already installed', () => {
      expect(() => TrackJS.install({ token: '' })).toThrow(TrackJSError);
    });
  });

  describe('track()', () => {

    test('returns promise that resolves OK', () => {
      expect.assertions(1);
      TrackJS.install({ token: 'test'});
      TrackJS.addLogTelemetry('log', 'a message');
      return TrackJS.track(new Error('node test with token'))
        .then(data => expect(data).toBe('OK'))
    });

  });

  describe('addLogTelemetry()', () => {

    test('throws when not installed', () => {
      expect(() => TrackJS.addLogTelemetry('log', 'test')).toThrow(TrackJSError);
    });

    test('it adds log telemetry', () => {
      let payload = null;
      let handler = jest.fn((_payload) => {
        payload = _payload;
        return false
      });
      TrackJS.install({ token: 'test'});
      TrackJS.onError(handler);
      TrackJS.addLogTelemetry('info', 'a message');
      TrackJS.addLogTelemetry('debug', 'another message', false, 2);
      TrackJS.track(new Error('test')).catch(() => null);
      expect(payload).toEqual(expect.objectContaining({
        console: [
          {
            severity: 'info',
            message: 'a message',
            timestamp: expect.any(String)
          },
          {
            severity: 'debug',
            message: '["another message",false,2]',
            timestamp: expect.any(String)
          }
        ]
      }))
    });
  });

});
