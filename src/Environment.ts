import { cli } from "./utils/cli";

/**
 * Attributes about the current operating environment.
 */
export class Environment {
  referrerUrl: string = '';
  start: Date = new Date();
  url: string = '';
  userAgent: string = '';

  constructor() {
    Environment.discoverDependencies();
  }

  /**
   * Returns a copy of the Environment.
   */
  clone(): Environment {
    return Object.assign(new Environment(), this);
  }

  /**
   * Get the current environmental dependencies.
   */
  getDependencies(): { [name:string]: string } {
    return Object.assign({}, Environment._dependencyCache);
  }

  /**
   * Discover the environment modules and versions. This is expensive, so we
   * should only do it on initial load.
   *
   * @param _bustCache {Boolean} Whether the existing dependency cache should be
   * discarded and rediscovered.
   */
  static discoverDependencies(_bustCache?: boolean): Promise<void> {

    if (Environment._dependencyCache && !_bustCache) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      Environment._dependencyCache = {};
      Promise
        .all([
          cli('npm ls --depth=0 --json --parseable'),
          cli('npm ls --depth=0 --json --parseable --g')
        ])
        .then((results) => {
          results.forEach((buf) => {
            let jsonResult = JSON.parse(buf.toString());

            if (jsonResult && jsonResult.dependencies) {
              Object.keys(jsonResult.dependencies).forEach((key) => {
                Environment._dependencyCache[key] = jsonResult.dependencies[key].version;
              });
            }
          });
          Environment._dependencyCache['node'] = process.versions['node'];
          resolve();
        })
        .catch((error) => {
          console.log('ERROR', error);
          // TODO FAULT
        });
    })
  }
  private static _dependencyCache: { [name: string]: string } = null;

};
