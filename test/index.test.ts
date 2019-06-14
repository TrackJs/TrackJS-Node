import { TrackJS } from '../src/index';

describe('TrackJS', () => {

  describe('install()', () => {
    test('it throws without options', () => {
      expect(() => TrackJS.install(null)).toThrow();
    })
    test('it throws without token', () => {
      expect(() => TrackJS.install({ token: '' })).toThrow();
    });
  })

  describe('track()', () => {

    test('returns promise that resolves OK', () => {
      expect.assertions(1);
      TrackJS.install({
        token: '8de4c78a3ec64020ab2ad15dea1ae9ff',
        application: 'pubconf',
        sessionId: 'session',
        userId: 'todd',
        version: '1.2.3'
      });
      return TrackJS.track(new Error('node test with token')).then(data => expect(data).toBe('OK'))
    })

  })

})