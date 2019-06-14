import { Agent } from '../src/Agent'

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

  describe('addTelemetry()', () => {
    let fakeAgent = null
    beforeEach(() => {
      fakeAgent = new Agent({ token: 'test' });
    })

    test('it adds telemetry', () => {
      fakeAgent.addTelemetry('t',  {
        foo: 'bar'
      });
      expect(fakeAgent.telemetry).toEqual([{
        id: expect.any(String),
        type: 't',
        data: {
          foo: 'bar'
        }
      }])
    });

  });

})
