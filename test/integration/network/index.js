const http = require('http');
const https = require('https');
const request = require('request');
const axios = require('axios');

const domain = require('domain');

const { TrackJS } = require('../../../dist');

console.log('Starting Networking Test...');

const TESTS_EXPECTED = 6;
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
    console.log("Assertion strict equal failed", thing1, thing2, new Error().stack);
    process.exit(1);
  }
}

TrackJS.install({
  token: '8de4c78a3ec64020ab2ad15dea1ae9ff',
  onError: (payload) => {
    switch(payload.customer.userId) {
      case 'http':
        assertStrictEqual(payload.message, '503 Service Unavailable: GET http://httpstat.us/503');
        assertStrictEqual(payload.entry, 'ajax');
        assertStrictEqual(payload.console.length, 0);
        assertStrictEqual(payload.network.length, 1);
        assertStrictEqual(payload.network[0].statusCode, 503);
        assertStrictEqual(payload.network[0].type, 'http');
        console.log('http request PASSED');
        break;
      case 'https':
        assertStrictEqual(payload.message, '404 Not Found: GET https://httpstat.us/404');
        assertStrictEqual(payload.entry, 'ajax');
        assertStrictEqual(payload.console.length, 0);
        assertStrictEqual(payload.network.length, 1);
        assertStrictEqual(payload.network[0].statusCode, 404);
        assertStrictEqual(payload.network[0].type, 'http');
        console.log('https request PASSED');
        break;
      case 'http.get':
        assertStrictEqual(payload.message, '502 Bad Gateway: GET http://httpstat.us/502');
        assertStrictEqual(payload.entry, 'ajax');
        assertStrictEqual(payload.console.length, 0);
        assertStrictEqual(payload.network.length, 1);
        assertStrictEqual(payload.network[0].statusCode, 502);
        assertStrictEqual(payload.network[0].type, 'http');
        console.log('http.get request PASSED');
        break;
      case 'https.get':
        assertStrictEqual(payload.message, '403 Forbidden: GET https://httpstat.us/403');
        assertStrictEqual(payload.entry, 'ajax');
        assertStrictEqual(payload.console.length, 0);
        assertStrictEqual(payload.network.length, 1);
        assertStrictEqual(payload.network[0].statusCode, 403);
        assertStrictEqual(payload.network[0].type, 'http');
        console.log('https.get request PASSED');
        break;
      case 'request':
        assertStrictEqual(payload.message, '501 Not Implemented: GET https://httpstat.us/501');
        assertStrictEqual(payload.entry, 'ajax');
        assertStrictEqual(payload.console.length, 0);
        assertStrictEqual(payload.network.length, 1);
        assertStrictEqual(payload.network[0].statusCode, 501);
        assertStrictEqual(payload.network[0].type, 'http');
        console.log('request PASSED');
        break;
      case 'axios':
        assertStrictEqual(payload.message, '401 Unauthorized: GET https://httpstat.us/401');
        assertStrictEqual(payload.entry, 'ajax');
        assertStrictEqual(payload.console.length, 0);
        assertStrictEqual(payload.network.length, 1);
        assertStrictEqual(payload.network[0].statusCode, 401);
        assertStrictEqual(payload.network[0].type, 'http');
        console.log('Axoim request PASSED');
        break;
      default:
        console.log('unknown userId error', payload);
        process.exit(1);
    }

    testComplete();
    return false;
  }
});

process.on('uncaughtException', (error) => {
  if (!error['__trackjs__']) {
    console.log('UNCAUGHT PROCESS ERROR', error);
    process.exit(1);
  }
});

domain.create('http.get').run(() => {
  TrackJS.configure({ userId: 'http.get' });
  http.get('http://httpstat.us/502');
});

domain.create('https.get').run(() => {
  TrackJS.configure({ userId: 'https.get' });
  https.get('https://httpstat.us/403');
});

domain.create('http').run(() => {
  TrackJS.configure({ userId: 'http' });
  const req = http.request('http://httpstat.us/503', { method: "GET" });
  req.end();
});

domain.create('https').run(() => {
  TrackJS.configure({ userId: 'https' });
  const req = https.request('https://httpstat.us/404', { method: "GET" });
  req.end();
});

domain.create('request').run(() => {
  TrackJS.configure({ userId: 'request' });
  request('https://httpstat.us/501');
});

domain.create('axios').run(() => {
  TrackJS.configure({ userId: 'axios' });
  axios.get('https://httpstat.us/401').catch(() => null);
});
