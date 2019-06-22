import { deduplicate } from '../../src/agentHelpers/deduplicate';
import { Agent } from "../../src/Agent";

jest.useFakeTimers();

describe('deduplicate()', () => {

  test('it prevents duplicate errors', () => {
    let error = new Error('test');
    let agent = new Agent({ token: 'test' });

    expect(deduplicate(agent.createErrorReport(error))).toBe(true);
    expect(deduplicate(agent.createErrorReport(error))).toBe(false);
  });

  test('does not prevent errors with different data', () => {
    let error1 = new Error('test 1');
    let error2 = new Error('test 2');
    let agent = new Agent({ token: 'test' });

    expect(deduplicate(agent.createErrorReport(error1))).toBe(true);
    expect(deduplicate(agent.createErrorReport(error2))).toBe(true);
  });

  test('does not prevent errors after timeout', () => {
    let error = new Error('test');
    let agent = new Agent({ token: 'test' });

    expect(deduplicate(agent.createErrorReport(error))).toBe(true);
    jest.runAllTimers();
    expect(deduplicate(agent.createErrorReport(error))).toBe(true);
  });

});