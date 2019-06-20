import https from 'https';
import { URL, URLSearchParams }  from 'url';
import { TrackJSError } from './types';

export type TransmitOptions = {

  /**
   * Base URL to transmit.
   */
  url: string,

  /**
   * HTTP Method to send.
   * GET, POST
   */
  method: string,

  /**
   * Data to be included as querystring parameters.
   */
  queryParams?: {  [name: string]: string }

  /**
   * Data payload to be transmitted.
   */
  payload?: Object

}

/**
 * Transmit a message to the TrackJS Service
 *
 * @param options {TransmitOptions}
 */
export function transmit(options: TransmitOptions) {
  let url = new URL(options.url);

  if (url.protocol !== 'https:') {
    throw new TrackJSError(`unsupported url ${options.url}`);
  }

  if (options.queryParams) {
    url.search = new URLSearchParams(options.queryParams).toString();
  }

  let req = https.request({
    method: options.method,
    hostname: url.hostname,
    port: url.port,
    path: `${url.pathname}${url.search}`,
  });

  if (options.method === 'POST' && options.payload) {
    let body = JSON.stringify(options.payload);
    req.setHeader('Content-Length', Buffer.byteLength(body));
    req.setHeader('Content-Type', 'application/json');
    req.write(body);
  }

  req.on('error', (err) => null) // TODO??
  req.end();
}
