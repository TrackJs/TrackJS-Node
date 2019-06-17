export interface TrackJSCapturePayload {
  bindStack?: string
  bindTime?: string
  console: Array<{
    timestamp: string
    severity: string
    message: string
  }>
  customer: {
    application: string
    correlationId: string
    sessionId: string
    token: string
    userId: string
    version: string
  }
  entry: string
  environment: {
    age: number
    dependencies: {
      [name: string]: string
    }
    originalUrl: string
    referrer: string
    userAgent: string
    viewportHeight: number
    viewportWidth: number
  }
  file: string
  message: string
  metadata: Array<{}>
  nav: Array<{}>
  network: Array<{}>
  url: string
  stack: string
  throttled: number
  timestamp: string
  visitor: Array<{}>
  version: string
}