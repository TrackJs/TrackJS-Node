import { truncate } from '../../src/agentHelpers'
import { Agent } from '../../src/Agent';

describe('truncate()', () => {

  beforeAll(() => {
    Agent.defaults.dependencies = false;
  });

  function generateRandomString(length: number) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  test('it does not change normal sized payload', () => {
    let agent = new Agent({ token: 'test' });
    for(var i=0; i<10; i++) {
      agent.telemetry.add('c', { message: generateRandomString(1000) })
    }
    let payload = agent.createErrorReport(new Error('test'));
    expect(truncate(payload)).toBe(true);
    expect(payload.console.length).toBe(10);
    payload.console.forEach((c) => {
      expect(c.message.length).toBe(1000);
    })
  });

  test('it truncates oversized payload', () => {
    let agent = new Agent({ token: 'test' });
    for(var i=0; i<10; i++) {
      agent.telemetry.add('c', { message: generateRandomString(100000) });
    }
    let payload = agent.createErrorReport(new Error('test'));
    expect(truncate(payload)).toBe(true);
    expect(payload.console.length).toBe(10);
    payload.console.forEach((c) => {
      expect(c.message.length).toBe(1010); // a bit more to handle the ...{n}
    })
  });

});
