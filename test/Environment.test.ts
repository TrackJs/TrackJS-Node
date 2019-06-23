import { Environment } from "../src/Environment";

describe('Environment', () => {
  describe('clone()', () => {
    it('creates an equal object', () => {
      let environment1 = new Environment();
      environment1.url = 'https://example.com';
      let environment2 = environment1.clone();
      expect(environment1).toEqual(environment2);
      expect(environment1).not.toBe(environment2);
    })
  });
  describe('discoverDependencies()', () => {
    it('discovers environment dependencies', () => {
      expect.assertions(1);
      let environment = new Environment();
      return Environment.discoverDependencies(true).then(() => {
        expect(environment.getDependencies()).toEqual(expect.objectContaining({
          'jest': '24.8.0'
        }));
      });
    })
  });
});
