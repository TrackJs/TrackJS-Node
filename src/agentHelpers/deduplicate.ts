import { TrackJSCapturePayload } from "../types";

const _history = new Set();

/**
 * Deduplicate errors from being sent.
 *
 * @param payload
 */
export function deduplicate(payload: TrackJSCapturePayload): boolean {
  let fingerprint = payload.customer.token + payload.message + payload.stack;

  if (!_history.has(fingerprint)) {
    _history.add(fingerprint);
    setTimeout(() => { _history.delete(fingerprint) }, 1000);
    return true;
  }

  return false;
}
