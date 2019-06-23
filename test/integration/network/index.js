const http = require('http');
const https = require('https');
const express = require('express');
const { TrackJS } = require('../../../dist');

console.log('Starting Networking Test...');

const TESTS_EXPECTED = 2;
let testsComplete = 0;

function testComplete() {
  testsComplete++;
  if (testsComplete >= TESTS_EXPECTED) {
    console.log('Networking Tests PASSED');
    process.exit(0);
  }
}
function assertStrictEqual(thing1, thing2) {
  if (thing1 !== thing2) {
    console.log("Assertion strict equal failed", thing1, thing2);
    process.exit(1);
  }
}

TrackJS.install({
  token: '8de4c78a3ec64020ab2ad15dea1ae9ff',
  onError: function(payload) {
    switch(payload.url) {
      case 'http://localhost:3001/http':
        assertStrictEqual(payload.url, 'http://localhost:3001/http');
        assertStrictEqual(payload.message, '503 Service Unavailable: GET http://httpstat.us/503');
        assertStrictEqual(payload.console.length, 0);
        assertStrictEqual(payload.network.length, 3);
        break;
      case 'http://localhost:3001/https':
        assertStrictEqual(payload.url, 'http://localhost:3001/https');
        assertStrictEqual(payload.message, '404 Not Found: GET https://httpstat.us/404');
        assertStrictEqual(payload.console.length, 0);
        assertStrictEqual(payload.network.length, 3);
        break;
      default:
        console.log('unknown url error', payload);
        process.exit(1);
    }

    testComplete();
    return false;
  }
});

express()
  .use(TrackJS.Handlers.expressRequestHandler())

  .get('/https', (req, res, next) => {
    https.get('https://httpstat.us/404', (response) => {
      res.status(200);
    });
  })

  .get('/http', (req, res, next) => {
    http.get('http://httpstat.us/503', (response) => {
      res.status(200);
    });
  })

  .use(TrackJS.Handlers.expressErrorHandler())

  .use((error, req, res, next) => {
    if (!error['__trackjs__']) {
      console.log('UNCAUGHT ERROR', error);
      process.exit(1);
    }
  })

  .listen(3001);

process.on('uncaughtException', function(error) {
  if (!error['__trackjs__']) {
    console.log('UNCAUGHT PROCESS ERROR', error);
    process.exit(1);
  }
});

http.get('http://localhost:3001/http');
http.get('http://localhost:3001/https');
