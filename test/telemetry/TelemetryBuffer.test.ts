import TelemetryBuffer, { TelemetryData } from "../../src/telemetry/TelemetryBuffer";

class TestTelemetry implements TelemetryData {}

describe('TelemetryBuffer', () => {

  let telemetry: TelemetryBuffer
  let bufferSize = 5

  beforeEach(() => {
    telemetry = new TelemetryBuffer(bufferSize);
  });

  describe('add()', () => {

    test('adds telemetry to buffer', () => {
      telemetry.add('test', new TestTelemetry());
      expect(telemetry._store.length).toBe(1);
    });

    test('rolls old items from the buffer', () => {
      for (var i = 0; i < 40; i++) {
        telemetry.add('test', new TestTelemetry());
      }
      expect(telemetry._store.length).toBe(bufferSize);
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

  // describe('all()', () => {

  //   test('returns array of objects from appender', () => {
  //     for (var i = 0; i < 5; i++) {
  //       log.add('test', { name: 'name' + i });
  //     }
  //     var objs = log.all('test');
  //     expect(objs.length).toBe(5);
  //     expect(objs[0]).toEqual({ name: 'name0' });
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