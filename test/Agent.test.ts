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
      let agent = new Agent(options);
      expect(agent.options).toEqual({
        token: 'token',
        application: '',
        sessionId: '',
        userId: '',
        version: ''
      });
    });

  });

  describe('Context', () => {

    test('it adds properties to payloads', () => {
      let agent = new Agent({ token: 'test' });
      agent.context.start = new Date(new Date().getTime() - 1);
      agent.context.url = 'http://example.com/path?foo=bar';
      agent.context.referrerUrl = 'http://test.com/path?bar=baz';
      agent.context.userAgent = 'user agent';
      let report = agent.createErrorReport(new Error('test'));
      expect(report).toEqual(expect.objectContaining({
        environment: expect.objectContaining({
          age: expect.any(Number),
          originalUrl: 'http://example.com/path?foo=bar',
          referrer: 'http://test.com/path?bar=baz',
          userAgent: 'user agent'
        }),
        url: 'http://example.com/path?foo=bar'
      }));
      expect(report.environment.age).toBeLessThan(5);
      expect(report.environment.age).toBeGreaterThanOrEqual(1);
    });

    test('it adds default properties to payloads', () => {
      let agent = new Agent({ token: 'test' });
      let report = agent.createErrorReport(new Error('test'));
      expect(report).toEqual(expect.objectContaining({
        environment: expect.objectContaining({
          age: expect.any(Number),
          originalUrl: '',
          referrer: '',
          userAgent: ''
        }),
        url: ''
      }));
    });

  });

  describe('metadata', () => {
    test('includes metadata from constructor', () => {
      let agent = new Agent({ token: 'test', metadata: { 'foo': 'bar' } });
      var report = agent.createErrorReport(new Error('test'));
      expect(report).toEqual(expect.objectContaining({
        metadata: [{ key: 'foo', value: 'bar'}]
      }))
    });
    test('includes metadata', () => {
      let agent = new Agent({ token: 'test' });
      agent.metadata.add('foo', 'bar');
      var report = agent.createErrorReport(new Error('test'));
      expect(report).toEqual(expect.objectContaining({
        metadata: [{ key: 'foo', value: 'bar'}]
      }))
    });
  });

  describe('onError', () => {

    test('it receives error events', () => {
      let agent = new Agent({ token: 'test '});
      expect.assertions(1);
      agent.onError((payload) => {
        expect(payload.message).toBe('test message');
        return false;
      })
      agent.captureError(new Error('test message')).catch(() => null);
    });

    test('it can ignore error events', () => {
      let agent = new Agent({ token: 'test '});
      expect.assertions(1);
      agent.onError((payload) => false);
      agent.captureError(new Error('test message')).catch((error) => {
        expect(error).toBe('TrackJS: error ignored.');
      })
    });

    test('it handles multiple callbacks', () => {
      let agent = new Agent({ token: 'test '});
      var cb1 = jest.fn(() => true);
      var cb2 = jest.fn(() => true);

      agent.onError(cb1);
      agent.onError(cb2);
      agent.captureError(new Error('test message')).catch(() => null);

      expect(cb1).toHaveBeenCalled();
      expect(cb2).toHaveBeenCalled();
    });

    test('it stops callbacks once ignored', () => {
      let agent = new Agent({ token: 'test '});
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

    test('it adds handler from constructor', () => {
      let handler = jest.fn((payload) => false);
      let options = {
        token: 'token',
        onError: handler
      };
      let agent = new Agent(options);
      expect(agent.options).not.toEqual(expect.objectContaining({
        onError: handler
      }));
      agent.captureError(new Error('test message')).catch(() => null);
      expect(handler).toHaveBeenCalled();
    })

  });

  describe('Telemetry', () => {

    test('it adds console telemetry to payload', () => {
      let agent = new Agent({ token: 'test' });
      console.log('a log message');
      console.warn('a warning', { foo: 'bar' })
      let payload = agent.createErrorReport(new Error('test error'));
      expect(payload.console).toEqual([
        {
          severity: 'log',
          message: 'a log message',
          timestamp: expect.any(String)
        },
        {
          severity: 'warn',
          message: '["a warning",{"foo":"bar"}]',
          timestamp: expect.any(String)
        }
      ])
    });

  });



})
