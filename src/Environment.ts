/**
 * Attributes about the current operating environment.
 */
export class Environment {
  referrerUrl: string = '';
  start: Date = new Date();
  url: string = '';
  userAgent: string = '';

  /**
   * Returns a copy of the Environment.
   */
  clone(): Environment {
    return Object.assign({}, this);
  }

};
