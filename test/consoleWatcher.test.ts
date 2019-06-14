import * as consoleWatcher from '../src/consoleWatcher';
import { Agent } from '../src/Agent';

describe('consoleWatcher', () => {
  describe('install()', () => {
    let fakeConsole = null;
    let fakeAgent = null;

    beforeEach(() => {
      fakeConsole = jest.genMockFromModule('console');
      fakeAgent = new Agent({ token: 'test' });
    })

    it('console patches add telemetry', () => {
      consoleWatcher.install(fakeAgent, fakeConsole);
      fakeConsole.log('a log message');
      expect(fakeAgent.telemetry).toEqual([{
        id: expect.any(String),
        type: 'c',
        data: {
          message: 'a log message',
          severity: 'log',
          timestamp: expect.any(String)
        }
      }]);
    })


  })
})
