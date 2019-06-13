import { TrackJS } from '../src/index';

describe('TrackJS', () => {

  describe('track()', () => {

    test('returns promise that resolves OK', () => {
      expect.assertions(1);
      return TrackJS.track(new Error('node test')).then(data => expect(data).toBe('OK'))
    })

  })

})