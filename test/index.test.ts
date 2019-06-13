import { TrackJS } from '../src/index';

describe('TrackJS', () => {

  describe('track()', () => {

    test('returns undefined', () => {
      expect(TrackJS.track(new Error('test'))).toBe(undefined);
    })

  })

})