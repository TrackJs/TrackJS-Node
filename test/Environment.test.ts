import { Environment } from "../src/Environment";

describe("Environment", () => {
  describe("clone()", () => {
    it("creates an equal object", () => {
      let environment1 = new Environment();
      environment1.url = "https://example.com";
      let environment2 = environment1.clone();
      expect(environment1).toEqual(environment2);
      expect(environment1).not.toBe(environment2);
    });
  });
  describe("discoverDependencies()", () => {
    it("reuses dependencies between instances", () => {
      let environment1 = new Environment();
      let environment2 = new Environment();
      let environment3 = environment2.clone();
      return environment1.discoverDependencies().then(() => {
        expect(Environment.dependencyCache).not.toBeUndefined();
        let dependencyCache = Environment.dependencyCache;

        return environment2.discoverDependencies().then(() => {
          expect(Environment.dependencyCache).toStrictEqual(dependencyCache);

          return environment3.discoverDependencies().then(() => {
            expect(Environment.dependencyCache).toStrictEqual(dependencyCache);
          });
        });
      });
    });
  });
});
