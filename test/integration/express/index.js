const http = require('http');
const express = require('express');
const { TrackJS } = require('../../../dist');

console.log('Starting ExpressJS Test...');

const TESTS_EXPECTED = 5;
let testsComplete = 0;

function testComplete() {
  testsComplete++;
  if (testsComplete >= TESTS_EXPECTED) {
    console.log('ExpressJS Tests PASSED');
    process.exit(0);
  }
}
function assertStrictEqual(thing1, thing2) {
  if (thing1 !== thing2) {
    console.log("Assertion strict equal failed", thing1, thing2, new Error().stack);
    process.exit(1);
  }
}

setTimeout(() => {
  console.log("Test timed out");
  process.exit(1);
}, 1000*15);

TrackJS.install({
  token: '8de4c78a3ec64020ab2ad15dea1ae9ff',
  onError: function(payload) {
    switch(payload.url) {
      case 'http://localhost:3001/sync':
        assertStrictEqual(payload.url, 'http://localhost:3001/sync');
        assertStrictEqual(payload.message, 'sync blew up');
        assertStrictEqual(payload.console.length, 1);
        assertStrictEqual(payload.console[0].message, 'a message from /sync');
        assertStrictEqual(payload.metadata.length, 3);
        assertStrictEqual(payload.metadata[0].key, 'test');
        assertStrictEqual(payload.metadata[0].value, 'express');
        // metadata[1] is client headers key
        assertStrictEqual(payload.metadata[2].key, 'action');
        assertStrictEqual(payload.metadata[2].value, 'sync');
        break;
      case 'http://localhost:3001/async':
        assertStrictEqual(payload.url, 'http://localhost:3001/async');
        assertStrictEqual(payload.message, 'async blew up');
        assertStrictEqual(payload.console.length, 1);
        assertStrictEqual(payload.console[0].message, 'a message from /async');
        assertStrictEqual(payload.metadata.length, 3);
        assertStrictEqual(payload.metadata[0].key, 'test');
        assertStrictEqual(payload.metadata[0].value, 'express');
        // metadata[1] is client headers key
        assertStrictEqual(payload.metadata[2].key, 'action');
        assertStrictEqual(payload.metadata[2].value, 'async');
        break;
      case 'http://localhost:3001/reject':
        assertStrictEqual(payload.url, 'http://localhost:3001/reject');
        assertStrictEqual(payload.message, 'rejected!');
        assertStrictEqual(payload.console.length, 1);
        assertStrictEqual(payload.console[0].message, 'a message from /reject');
        assertStrictEqual(payload.metadata.length, 3);
        assertStrictEqual(payload.metadata[0].key, 'test');
        assertStrictEqual(payload.metadata[0].value, 'express');
        // metadata[1] is client headers key
        assertStrictEqual(payload.metadata[2].key, 'action');
        assertStrictEqual(payload.metadata[2].value, 'reject');
        break;
      case 'http://localhost:3001/console':
        assertStrictEqual(payload.url, 'http://localhost:3001/console');
        assertStrictEqual(payload.message, 'console blew up');
        assertStrictEqual(payload.console.length, 1);
        assertStrictEqual(payload.console[0].message, 'console blew up');
        break;
      case 'http://localhost:3001/headers':
          assertStrictEqual(payload.url, 'http://localhost:3001/headers');
          assertStrictEqual(payload.message, 'checking headers');
          assertStrictEqual(payload.metadata.length, 2);
          assertStrictEqual(payload.metadata[1].key, '__TRACKJS_REQUEST_USER_AGENT');
          assertStrictEqual(payload.metadata[1].value, 'test user agent');
          break;
      default:
        console.log('unknown url error', payload);
        process.exit(1);
    }

    testComplete();
    return false;
  }
});

TrackJS.addMetadata('test', 'express');

express()
  .use(TrackJS.Handlers.expressRequestHandler())

  .get('/sync', (req, res, next) => {
    TrackJS.addLogTelemetry('log', 'a message from /sync');
    TrackJS.addMetadata('action', 'sync');
    throw new Error('sync blew up');
  })

  .get('/async', (req, res, next) => {
    TrackJS.addLogTelemetry('log', 'a message from /async');
    setTimeout(() => {
      TrackJS.addMetadata('action', 'async');
      throw new Error('async blew up');
    }, 100);
  })

  .get('/reject', (req, res, next) => {
    TrackJS.addLogTelemetry('log', 'a message from /reject');
    new Promise((resolve, reject) => {
      TrackJS.addMetadata('action', 'reject');
      setTimeout(() => {
        reject('rejected!');
      }, 100);
    })
  })

  .get('/console', (req, res, next) => {
    console.error('console blew up');
    res.status(200);
  })

  .get('/headers', (req, res, next) => {
    throw new Error('checking headers');
  })

  .get('/ok', (req, res, next) => {
    TrackJS.addLogTelemetry('log', 'a message from /ok');
    TrackJS.addMetadata('action', 'ok');
    res.status(200);
  })

  .use(TrackJS.Handlers.expressErrorHandler({ next: true }))

  .use((error, req, res, next) => {
    if (!error['__trackjs__']) {
      console.log('UNCAUGHT EXPRESS ERROR', error);
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

http.get('http://localhost:3001/async');
http.get('http://localhost:3001/reject');
http.get('http://localhost:3001/sync');
http.get('http://localhost:3001/console');
http.get({
  hostname: 'localhost',
  port: 3001,
  path: '/headers',
  headers: {
    'user-agent': 'test user agent'
  }
});
http.get('http://localhost:3001/ok');
