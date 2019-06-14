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

})
