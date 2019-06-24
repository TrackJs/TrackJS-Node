import os from "os";

/**
 * Made-up UserAgent-like string for our Node Agent.
 */
export const userAgent = `node/${
  process.version
} (${os.platform()} ${os.arch()} ${os.release()})`;
