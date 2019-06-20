import { TelemetryBuffer } from '../../src/telemetry';

describe('TelemetryBuffer', () => {

  let telemetry: TelemetryBuffer
  let bufferSize = 5

  beforeEach(() => {
    telemetry = new TelemetryBuffer(bufferSize);
  });

  describe('add()', () => {

    it('adds telemetry to buffer', () => {
      telemetry.add('test', {});
      expect(telemetry.count()).toBe(1);
    });

    it('rolls old items from the buffer', () => {
      for (var i = 0; i < 40; i++) {
        telemetry.add('test', {});
      }
      expect(telemetry.count()).toBe(bufferSize);
    });

  });

  describe('clear()', () => {
    it('it empties the buffer', () => {
      let key = telemetry.add('test', {});
      telemetry.clear();
      expect(telemetry.count()).toBe(0);
      expect(telemetry.get(key)).toBeNull();
    })
  });

  describe('clone()', () => {
    it('it creates equal buffer', () => {
      telemetry.add('test', {});
      telemetry.add('test', {});
      var buffer2 = telemetry.clone();
      expect(telemetry.getAllByCategory('test')).toEqual(buffer2.getAllByCategory('test'));
    });
    it('it can be cross-referenced', () => {
      let key1 = telemetry.add('test', {});
      var buffer2 = telemetry.clone();
      expect(telemetry.get(key1)).toBe(buffer2.get(key1));
    });
  });

  describe('count()', () => {
    it('it returns correct count', () => {
      telemetry.add('test', {});
      telemetry.add('test', {});
      telemetry.add('test', {});
      expect(telemetry.count()).toBe(3);
    });
  });

  describe('get()', () => {
    it('returns items from store', () => {
      let item = { foo: 'bar' };
      let key = telemetry.add('test', item);
      expect(telemetry.get(key)).toBe(item);
    });
  })

  describe('getAllByCategory()', () => {
    it('returns all objects from category', () => {
      let telemetry1 = {};
      let telemetry2 = {};
      let telemetry3 = {};
      let telemetry4 = {};
      let telemetry5 = {};
      telemetry.add('test', telemetry1);
      telemetry.add('other', telemetry2);
      telemetry.add('other', telemetry3);
      telemetry.add('test', telemetry4);
      telemetry.add('test', telemetry5);

      expect(telemetry.getAllByCategory('test')).toEqual([
        telemetry1,
        telemetry4,
        telemetry5
      ]);
      expect(telemetry.getAllByCategory('other')).toEqual([
        telemetry2,
        telemetry3
      ]);
      expect(telemetry.getAllByCategory('empty')).toEqual([]);
    });
  });

});