<p align="center">
  <a href="https://trackjs.com/" target="_blank" align="center">
    <img src="https://trackjs.com/assets/images/brand/logo_full_charcoal_red.svg" width="280">
  </a>
  <br />
</p>

**This Agent is in Beta, not recommended for production use until v1.0.0.**

# TrackJS Agent for NodeJS

## Reference

- [TrackJS Node Documentation](https://docs.trackjs.com/node-agent/installation/)

## Usage

To use the Agent, call `TrackJS.install(options)` as soon as possible in your code. It will install the monitors into the environment.

```javascript
// ES5
const TrackJS = require("trackjs-node").TrackJS;
// ES6
import { TrackJS } from "trackjs-node";

TrackJS.install({
  token: "YOUR_TOKEN"
  /* other options */
});
```

To add more context to your errors, add context and metadata through the agent.

```javascript
TrackJS.configure({
  sessionId: "session",
  version: "1.0.0",
  userId: "frank@gmail.com"
});

// or add arbitrary keys for whatever you think is important
TrackJS.addMetadata({
  foo: "bar"
});
```

TrackJS will automatically gather Telemetry and send errors. If you want to trigger these events yourself, you can.

```javascript
TrackJS.addLogTelemetry("warn", [
  "a warning message",
  {
    /*state object*/
  }
]);

TrackJS.track(new Error("everything has gone wrong!"));
```

