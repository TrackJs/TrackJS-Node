export interface TrackJSOptions {
  token: string,
  application?: string,
  metadata?: { [name: string]: string },
  sessionId?: string,
  userId?: string,
  version?: string,
}
