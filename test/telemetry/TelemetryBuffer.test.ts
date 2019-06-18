import TelemetryBuffer from "../../src/telemetry/TelemetryBuffer";

describe('TelemetryBuffer', () => {

  let telemetry: TelemetryBuffer
  let bufferSize = 5

  beforeEach(() => {
    telemetry = new TelemetryBuffer(bufferSize);
  });

  describe('add()', () => {

    test('adds telemetry to buffer', () => {
      telemetry.add('test', {});
      expect(telemetry._store.length).toBe(1);
    });

    test('rolls old items from the buffer', () => {
      for (var i = 0; i < 40; i++) {
        telemetry.add('test', {});
      }
      expect(telemetry._store.length).toBe(bufferSize);
    });

  });

  describe('getAllByCategory()', () => {
    test('returns all objects from category', () => {
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

  // describe('get()', () => {

  //   test('returns an object from appender', () => {
  //     var obj = { name: 'thing' };
  //     var key = log.add('test', obj);
  //     expect(log.get('test', key)).toBe(obj);
  //   });

  //   test('returns false with bad key', () => {
  //     expect(log.get('test', 'crap')).toBe(false);
  //   });

  // });



  // describe('clear()', () => {

  //   test('empties all appenders', () => {
  //     for (var i = 0; i < 5; i++) {
  //       log.add('test' + i, { name: 'name' + i });
  //     }
  //     log.clear();
  //     expect(log.appender.length).toBe(0);
  //   });

  // });

});