import http from 'http';
import { TrackJSNetwork } from '../types';

export class NetworkTelemetry implements TrackJSNetwork {

  /** @inheritdoc */
  completedOn: string;
  /** @inheritdoc */
  method: string;
  /** @inheritdoc */
  startedOn: string;
  /** @inheritdoc */
  statusCode: number;
  /** @inheritdoc */
  statusText: string;
  /** @inheritdoc */
  url: string;

  constructor(request: TrackJSNetwork | http.ClientRequest) {
    if (request instanceof http.ClientRequest) {
      this.method = request['method'];
      this.url = `${request['agent'].protocol}//${request.getHeader('host')}${request.path}`;

      request.once('socket', () => {
        this.startedOn = new Date().toISOString();
      });

      request.once('response', (response: http.IncomingMessage) => {
        this.statusCode = response.statusCode;
        this.statusText = response.statusMessage;
        this.completedOn = new Date().toISOString();
      });
    }
    else {
      this.completedOn = request.completedOn;
      this.method = request.method;
      this.startedOn = request.startedOn;
      this.statusCode = request.statusCode;
      this.statusText = request.statusText;
      this.url = request.url;
    }
  }
}
