import http from 'http';
import https from 'https';
import { NetworkTelemetry } from '../../src/telemetry';

describe('NetworkTelemetry', () => {

  test('it creates from object', () => {
    let object = {
      completedOn: '2000-01-01T00:00:01.000Z',
      method: 'GET',
      startedOn: '2000-01-01T00:00:00.000Z',
      statusCode: 200,
      statusText: 'OK',
      url: 'https://example.com/'
    };
    let nt = new NetworkTelemetry(object);
    expect(nt).toEqual(object);
  });

  test('it creates from ClientRequest', () => {
    let request = http.get('http://example.com/?foo=bar');
    let nt = new NetworkTelemetry(request);
    expect(nt).toEqual(expect.objectContaining({
      method: 'GET',
      url: 'http://example.com/?foo=bar'
    }));
  });

  test('it gathers state events from http.ClientRequest', () => {
    expect.assertions(1);
    return new Promise(resolve => {
      let request = http.get('http://example.com/?foo=bar');
      let nt = new NetworkTelemetry(request);
      request.on('response', () => {
        expect(nt).toEqual(expect.objectContaining({
          completedOn: expect.any(String),
          method: 'GET',
          startedOn: expect.any(String),
          statusCode: 200,
          statusText: 'OK',
          url: 'http://example.com/?foo=bar'
        }));
        resolve();
      });
      request.end();
    });
  });

  test('it gathers state events from https.ClientRequest', () => {
    expect.assertions(1);
    return new Promise(resolve => {
      let request = https.get('https://example.com/?foo=bar');
      let nt = new NetworkTelemetry(request);
      request.on('response', () => {
        expect(nt).toEqual(expect.objectContaining({
          completedOn: expect.any(String),
          method: 'GET',
          startedOn: expect.any(String),
          statusCode: 200,
          statusText: 'OK',
          url: 'https://example.com/?foo=bar'
        }));
        resolve();
      });
      request.end();
    });
  });

});