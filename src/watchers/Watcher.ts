import { TrackJSOptions } from "../types";

/**
 * Watches for a particular situation in the environment and handles notifying
 * the running agent appropriately.
 */
export interface Watcher {
  /**
   * Install the watcher into the environment.
   * @see uninstall
   */
  install(options: TrackJSOptions): void;

  /**
   * Removes the watcher from the environment.
   * @see install
   */
  uninstall(): void;
}
