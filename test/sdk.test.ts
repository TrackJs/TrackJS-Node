import * as TrackJS from '../src/sdk';
import { TrackJSError } from '../src/types/TrackJSError';

describe('sdk', () => {

  describe('error checking', () => {
    test('install throws without options', () => {
      expect(() => TrackJS.install(null)).toThrow(TrackJSError);
    })
    test('install throws without token', () => {
      expect(() => TrackJS.install({ token: '' })).toThrow(TrackJSError);
    });
    test('install throws if already installed', () => {
      expect(() => TrackJS.install({ token: '' })).toThrow(TrackJSError);
    });
    test('uninstall returns okay without install', () => {
      expect(() => TrackJS.uninstall()).not.toThrow();
    });
    test('addMetadata throws when not installed', () => {
      expect(() => TrackJS.addMetadata('foo', 'bar')).toThrow(TrackJSError);
    });
    test('removeMetadata throws when not installed', () => {
      expect(() => TrackJS.addMetadata('foo', 'bar')).toThrow(TrackJSError);
    });
    test('addLogTelemetry throws when not installed', () => {
      expect(() => TrackJS.addLogTelemetry('log', 'test')).toThrow(TrackJSError);
    });
    test('onError throws when not installed', () => {
      expect(() => TrackJS.onError((payload) => false)).toThrow(TrackJSError);
    });
    test('Handlers.expressErrorHandler throws when not installed', () => {
      expect(() => TrackJS.Handlers.expressErrorHandler()).toThrow(TrackJSError);
    });
  });

});
