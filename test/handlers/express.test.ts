import domain from "domain";
import http from "http";
import { expressErrorHandler, expressRequestHandler } from "../../src/handlers/express";
import { Socket } from "net";
import { Agent } from "../../src/Agent";
import { AgentRegistrar } from "../../src/AgentRegistrar";

beforeAll(() => {
  Agent.defaults.dependencies = false;
});

describe("expressRequestHandler", () => {
  let fakeReq, fakeRes;
  let fakeAgent;

  beforeEach(() => {
    fakeReq = new http.IncomingMessage(new Socket());
    fakeReq["get"] = jest.fn();
    fakeRes = new http.ServerResponse(fakeReq);
    fakeAgent = new Agent({ token: "test" });
    AgentRegistrar.getCurrentAgent = jest.fn(() => fakeAgent);
  });

  it("creates and enters domain context", () => {
    expect.assertions(2);
    expect(domain["active"]).toBe(null);
    expressRequestHandler()(fakeReq, fakeRes, () => {
      expect(domain["active"]).toBeDefined();
    });
  });

  it("sets request environment parameters", () => {
    fakeReq.headers["referer"] = "https://referer.com";
    fakeReq["protocol"] = "https";
    fakeReq["get"] = jest.fn(() => "example.com");
    fakeReq["originalUrl"] = "/";

    expressRequestHandler()(fakeReq, fakeRes, () => {
      expect(fakeAgent.environment.referrerUrl).toBe("https://referer.com");
      expect(fakeAgent.environment.url).toBe("https://example.com/");
    });
  });
});

describe("expressErrorHandler", () => {
  let fakeReq, fakeRes;
  let fakeAgent;

  beforeEach(() => {
    fakeReq = new http.IncomingMessage(new Socket());
    fakeRes = new http.ServerResponse(fakeReq);
    fakeAgent = new Agent({ token: "test" });
    AgentRegistrar.getCurrentAgent = jest.fn(() => fakeAgent);
  });

  it("captures errors with status code", () => {
    let error = new Error("test");
    error["statusCode"] = 503;
    let next = jest.fn();
    jest.spyOn(fakeAgent, "captureError");
    expressErrorHandler()(error, fakeReq, fakeRes, next);
    expect(fakeAgent.captureError).toHaveBeenCalledWith(error);
  });

  it("passes error to next", () => {
    let error = new Error("test");
    let next = jest.fn();
    expressErrorHandler({ next: true })(error, fakeReq, fakeRes, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("does not capture duplicate errors", () => {
    let error = new Error("test");
    error["statusCode"] = 503;
    let next = jest.fn();
    jest.spyOn(fakeAgent, "captureError");
    expressErrorHandler()(error, fakeReq, fakeRes, next);
    expressErrorHandler()(error, fakeReq, fakeRes, next);
    expect(fakeAgent.captureError).toHaveBeenCalledTimes(1);
  });
});
