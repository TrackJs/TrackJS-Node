import { TrackJSNetwork } from "../types";

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
  type: string;
  /** @inheritdoc */
  url: string;
}
