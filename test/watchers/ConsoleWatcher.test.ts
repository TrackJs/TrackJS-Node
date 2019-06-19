import Agent from "../../src/Agent";
import { ConsoleWatcher } from "../../src/watchers";
import ConsoleTelemetryData from "../../src/telemetry/ConsoleTelemetryData";

describe('ConsoleWatcher', () => {
  describe('install()', () => {
    let fakeConsole = null;
    let fakeAgent = null;
    let consoleWatcher = null;

    beforeEach(() => {
      fakeConsole = jest.genMockFromModule('console');
      fakeAgent = new Agent({ token: 'test' });
      consoleWatcher = new ConsoleWatcher(fakeAgent);
    })

    afterEach(() => {
      consoleWatcher.uninstall();
    })

    it('console patches add telemetry', () => {
      fakeAgent.telemetry.add = jest.fn();
      consoleWatcher.install(fakeConsole);
      fakeConsole.log('a log message');
      expect(fakeAgent.telemetry.add).toHaveBeenCalledWith('c', expect.any(ConsoleTelemetryData))
    })

    it('calls through to console', () => {
      let originalConsoleLog = fakeConsole.log;
      consoleWatcher.install(fakeConsole);
      fakeConsole.log('a log message', 2, 3, 4);
      expect(originalConsoleLog).toHaveBeenCalledWith('a log message', 2, 3, 4);
    })
  })
})
