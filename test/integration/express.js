const http = require('http');
const express = require('express');
const TrackJS = require('../../dist/index.js');

console.log('Testing express integration...');

function assertStrictEqual(thing1, thing2) {
  if (thing1 !== thing2) {
    console.error("Assertion strict equal failed", thing1, thing2);
    process.exit(1);
  }
}

TrackJS.install({
  token: 'test',
  onError: function(payload) {
    // console.log(payload);
    assertStrictEqual(payload.message, 'a test error');
    assertStrictEqual(payload.console.length, 1);
    assertStrictEqual(payload.console[0].message, 'a message');

    console.log('Express integration PASSED');
    process.exit(0);
    return false;
  }
});

// add onError to check and ignore
// setup express with a path that errors
let app = express()
  .get('/throw', (req, res, next) => {
    console.log('a message');
    throw new Error('a test error');
  })
  .use(TrackJS.Handlers.expressErrorHandler())
  .listen(3001);

http.get('http://localhost:3001/throw');
