import * as TrackJS from '../src/sdk';
import { TrackJSError } from '../src/types/TrackJSError';

describe('sdk', () => {

  describe('without install', () => {
    test('addLogTelemetry() throws', () => {
      expect(() => TrackJS.addLogTelemetry('log', 'test')).toThrow(TrackJSError);
    });
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

  describe('installed', () => {
    beforeAll(() => {
      TrackJS.install({
        token: '8de4c78a3ec64020ab2ad15dea1ae9ff',
        application: 'pubconf',
        sessionId: 'session',
        userId: 'todd',
        version: '1.2.3'
      });
    });

    describe('track()', () => {
      test('returns promise that resolves OK', () => {
        expect.assertions(1);
        TrackJS.addLogTelemetry('log', 'a message');

        return TrackJS.track(new Error('node test with token')).then(data => expect(data).toBe('OK'))
      })

    })

  });

});
