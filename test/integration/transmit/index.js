const express = require('express')
const fs = require('fs')
const https = require('https')
const { TrackJS } = require('../../../dist');

console.log('Starting Transmitter Test...');

// Ignore our silly self-signed cert for now.
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const TESTS_EXPECTED = 2;
let testsComplete = 0;

function testComplete() {
  testsComplete++;
  if (testsComplete >= TESTS_EXPECTED) {
    console.log('Transmitter Tests PASSED');
    process.exit(0);
  }
}
function assertStrictEqual(thing1, thing2) {
  if (thing1 !== thing2) {
    console.error("Assertion strict equal failed", thing1, thing2, Error.captureStackTrace());
    process.exit(1);
  }
}

let fakeTrackJSServer = express()
  .use(express.json({ type: '*/*' }))
  .post('/capture', (req, res, next) => {
    assertStrictEqual(req.query.token, 'testtoken');
    assertStrictEqual(req.body.message, 'test');

    res.status(204);
    testComplete();
  })
  .get('/usage.gif', (req, res, next) => {
    assertStrictEqual(req.query.token, 'testtoken');
    assertStrictEqual(req.query.application, 'test-case');

    var buf = new Buffer(43);
    buf.write("R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", "base64");
    res.send(buf, { 'Content-Type': 'image/gif' }, 200);
    testComplete();
  });

https.createServer({
  key: fs.readFileSync(__dirname + '/server.key'),
  cert: fs.readFileSync(__dirname + '/server.cert')
}, fakeTrackJSServer).listen(3001);


TrackJS.install({
  token: 'testtoken',
  application: 'test-case',
  captureURL: 'https://localhost:3001/capture',
  usageURL: 'https://localhost:3001/usage.gif'
});

TrackJS.usage();
TrackJS.track('test');
