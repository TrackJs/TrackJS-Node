import Agent from '../src/Agent'

describe('Agent', () => {

  describe('constructor()', () => {

    test('it initializes with options', () => {
      let options = {
        token: 'token',
        application: 'application',
        sessionId: 'session',
        userId: 'user',
        version: 'version'
      };
      let context = new Agent(options);
      expect(context.options).toEqual(options);
    });

    test('it initializes with default options', () => {
      let options = {
        token: 'token'
      };
      let context = new Agent(options);
      expect(context.options).toEqual({
        token: 'token',
        application: '',
        sessionId: '',
        userId: '',
        version: ''
      });
    });

  })

  describe('onError', () => {
    let agent: Agent;
    beforeEach(() => {
      agent = new Agent({ token: 'test' });
    })

    test('it receives error events', () => {
      expect.assertions(1);
      agent.onError((payload) => {
        expect(payload.message).toBe('test message');
        return false;
      })
      agent.captureError(new Error('test message')).catch(() => null);
    });

    test('it can ignore error events', () => {
      expect.assertions(1);
      agent.onError((payload) => false);
      agent.captureError(new Error('test message')).catch((error) => {
        expect(error).toBe('TrackJS: error ignored.');
      })
    });

    test('it handles multiple callbacks', () => {
      var cb1 = jest.fn(() => true);
      var cb2 = jest.fn(() => true);

      agent.onError(cb1);
      agent.onError(cb2);
      agent.captureError(new Error('test message')).catch(() => null);

      expect(cb1).toHaveBeenCalled();
      expect(cb2).toHaveBeenCalled();
    });

    test('it stops callbacks once ignored', () => {
      var cb1 = jest.fn(() => true);
      var cb2 = jest.fn(() => false);
      var cb3 = jest.fn(() => true);

      agent.onError(cb1);
      agent.onError(cb2);
      agent.onError(cb3);
      agent.captureError(new Error('test message')).catch(() => null);

      expect(cb1).toHaveBeenCalled();
      expect(cb2).toHaveBeenCalled();
      expect(cb3).not.toHaveBeenCalled();
    });

  });

})
