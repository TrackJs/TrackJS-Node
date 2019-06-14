import ConsoleTelemetryData from "../../src/telemetry/ConsoleTelemetryData";

describe('ConsoleTelemetryData', () => {

  describe('normalizeSeverity()', () => {

    test('it returns supported values', () => {
      expect.assertions(5);
      ['debug','info','warn','error','log'].forEach((sev) => {
        expect(ConsoleTelemetryData.normalizeSeverity(sev)).toBe(sev)
      });
    });

    test('it normalizes casing', () => {
      expect(ConsoleTelemetryData.normalizeSeverity('DEBUG')).toBe('debug');
      expect(ConsoleTelemetryData.normalizeSeverity('eRrOr')).toBe('error');
      expect(ConsoleTelemetryData.normalizeSeverity('loG')).toBe('log');
    });

    test('it returns default for unsupported', () => {
      expect.assertions(5);
      ['','custom','a really really really long value', 'something else','false'].forEach((sev) => {
        expect(ConsoleTelemetryData.normalizeSeverity(sev)).toBe('log')
      });
    });

  });

  describe('constructor()', () => {

    test('it handles weird message formats', () => {
      expect(new ConsoleTelemetryData('log', 'a message').message).toBe('a message');
      expect(new ConsoleTelemetryData('log', 1, 2, 3, 4, 5).message).toBe('[1,2,3,4,5]');
      expect(new ConsoleTelemetryData('log', { foo: 'bar' }).message).toBe('{\"foo\":\"bar\"}');
      expect(new ConsoleTelemetryData('log', { foo: 'bar' }, { bar: 'baz' }).message)
        .toBe('[{\"foo\":\"bar\"},{\"bar\":\"baz\"}]');
    })

  });


});