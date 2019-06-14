import * as consoleWatcher from '../src/consoleWatcher';
import Agent from '../src/Agent';
import ConsoleTelemetryData from '../src/telemetry/ConsoleTelemetryData';

describe('consoleWatcher', () => {
  describe('install()', () => {
    let fakeConsole = null;
    let fakeAgent = null;

    beforeEach(() => {
      fakeConsole = jest.genMockFromModule('console');
      fakeAgent = new Agent({ token: 'test' });
    })

    it('console patches add telemetry', () => {
      fakeAgent.telemetry.add = jest.fn();
      consoleWatcher.install(fakeAgent, fakeConsole);
      fakeConsole.log('a log message');
      expect(fakeAgent.telemetry.add).toHaveBeenCalledWith('c', expect.any(ConsoleTelemetryData))
    })

    it('calls through to console', () => {
      let originalConsoleLog = fakeConsole.log;
      consoleWatcher.install(fakeAgent, fakeConsole);
      fakeConsole.log('a log message', 2, 3, 4);
      expect(originalConsoleLog).toHaveBeenCalledWith('a log message', 2, 3, 4);
    })
  })
})
