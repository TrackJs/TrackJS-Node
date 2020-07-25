import { userAgent } from "./utils/userAgent";
import { dirname, join } from "path";
import { existsSync, readFileSync } from "fs";

/**
 * Attributes about the current operating environment.
 */
export class Environment {
  referrerUrl: string = "";
  start: Date = new Date();
  url: string = "";
  userAgent: string = userAgent;
  static dependencyCache: { [name: string]: string } = null;

  /**
   * Returns a copy of the Environment.
   */
  clone(): Environment {
    return Object.assign(new Environment(), this);
  }

  /**
   * Get the current environmental dependencies.
   */
  getDependencies(): { [name: string]: string } {
    if (!Environment.dependencyCache) {
      this.discoverDependencies();
    }
    return Object.assign({}, Environment.dependencyCache);
  }

  /**
   * Discover the environment modules and versions. This is expensive, so we
   * should only do it once.
   *
   * @param _bustCache {Boolean} Whether the existing dependency cache should be
   * discarded and rediscovered.
   */
  discoverDependencies(_bustCache?: boolean): void {
    if (Environment.dependencyCache && !_bustCache) {
      return;
    }

    Environment.dependencyCache = {};

    let pathCache = {};
    let rootPaths = (require.main && require.main.paths) || [];
    let moduleFiles = (require.cache ? Object.keys(require.cache as {}) : []);

    function recurseUpDirTree(dir: string, roots: string[] = [], maxDepth = 10) {
      if (maxDepth === 0 || !dir || pathCache[dir] || roots.indexOf(dir) >= 0) {
        return;
      }

      pathCache[dir] = 1;
      let packageFile = join(dir, "package.json");

      if (existsSync(packageFile)) {
        try {
          let packageInfo = JSON.parse(readFileSync(packageFile, "utf8"));
          Environment.dependencyCache[packageInfo.name] = packageInfo.version;
        }
        catch(err) {/* bad json */}
      }
      else {
        // Recursion!
        return recurseUpDirTree(dirname(dir), roots, maxDepth--);
      }
    }

    moduleFiles.forEach((moduleFile) => {
      let modulePath = dirname(moduleFile);
      recurseUpDirTree(modulePath, rootPaths);
    });
  }
}
