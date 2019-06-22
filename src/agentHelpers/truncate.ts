import { TrackJSCapturePayload } from '../types';
import { truncateString } from '../utils/truncateString';

const MAX_SIZE = 100000;

function getByteLength(str: string): number {
  return Buffer.byteLength(str, 'utf8');
}

function isConsoleTelemetryTooBig(payload: TrackJSCapturePayload): boolean {
  return payload.console.reduce((prev, curr) => {
    return prev + (curr.message || '').length;
  }, 0) >= 80000;
}

/**
 * Truncate the contents of the payload to help ensure that it will be accepted
 * by the TrackJS Server. Truncates the contents of Console Telemetry until
 *
 * @param payload
 */
export function truncate(payload: TrackJSCapturePayload): boolean {
  if (getByteLength(JSON.stringify(payload)) < MAX_SIZE) { return true; }

  let nextConsoleTruncationIdx = 0;
  while(isConsoleTelemetryTooBig(payload) && nextConsoleTruncationIdx < payload.console.length) {
    payload.console[nextConsoleTruncationIdx].message = truncateString(payload.console[nextConsoleTruncationIdx].message, 1000);
    nextConsoleTruncationIdx++;
  }

  return true;
}
