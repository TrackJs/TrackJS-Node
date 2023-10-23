import * as isType from "../../src/utils/isType";

describe("isType", () => {
  describe("isArray(thing)", () => {
    test("returns true for Array literal", () => {
      expect(isType.isArray([])).toBe(true);
    });
    test("returns true for Array instance", () => {
      expect(isType.isArray(new Array())).toBe(true); // eslint-disable-line
      expect(isType.isArray(Array())).toBe(true); // eslint-disable-line
    });
    test("returns false for other things", () => {
      expect(isType.isArray(new Object())).toBe(false); // eslint-disable-line
      expect(isType.isArray({})).toBe(false);
      expect(isType.isArray("[object Array]")).toBe(false);
      expect(isType.isArray(0)).toBe(false);
      expect(isType.isArray(null)).toBe(false);
      expect(isType.isArray(undefined)).toBe(false);
      expect(isType.isArray(NaN)).toBe(false);
    });
  });

  describe("isBoolean(thing)", () => {
    test("returns true for a Boolean literal", () => {
      expect(isType.isBoolean(true)).toBe(true);
      expect(isType.isBoolean(false)).toBe(true);
    });
    test("returns true for a Boolean instance", () => {
      expect(isType.isBoolean(new Boolean("true"))).toBe(true); // eslint-disable-line
      expect(isType.isBoolean(new Boolean())).toBe(true); // eslint-disable-line
      expect(isType.isBoolean(Boolean(0))).toBe(true);
    });
    test("returns false for other things", () => {
      expect(isType.isBoolean("false")).toBe(false);
      expect(isType.isBoolean(0)).toBe(false);
      expect(isType.isBoolean(new Object())).toBe(false); // eslint-disable-line
      expect(isType.isBoolean({})).toBe(false);
      expect(isType.isBoolean([0])).toBe(false);
      expect(isType.isBoolean(null)).toBe(false);
      expect(isType.isBoolean(undefined)).toBe(false);
    });
  });

  describe("isError(thing)", () => {
    test("returns true when error instance", () => {
      expect(isType.isError(new Error("test"))).toBe(true);
    });
    test("returns true when caught error", () => {
      var e;
      try {
        expect["undef"]();
      } catch (err) {
        e = err;
      }
      expect(isType.isError(e)).toBe(true);
    });
    test("returns true when DOM Exception", () => {
      expect(isType.isError(new DOMException("test"))).toBe(true);
    });
    test("returns true for error-shaped objects", () => {
      expect(isType.isError({ name: "TestError", message: "message" })).toBe(true);
    });
    test("returns false for other things", () => {
      expect(isType.isError(new Object())).toBe(false); // eslint-disable-line
      expect(isType.isError({})).toBe(false);
      expect(isType.isError("[object Array]")).toBe(false);
      expect(isType.isError(0)).toBe(false);
      expect(isType.isError(null)).toBe(false);
      expect(isType.isError(undefined)).toBe(false);
      expect(isType.isError(NaN)).toBe(false);
    });
  });

  describe("isFunction()", function() {
    test("returns true with function", function() {
      expect(isType.isFunction(function() {})).toBe(true);
    });

    test("returns false with non-function", function() {
      expect(isType.isFunction(null)).toBe(false);
      expect(isType.isFunction(undefined)).toBe(false);
      expect(isType.isFunction(NaN)).toBe(false);
      expect(isType.isFunction(42)).toBe(false);
      expect(isType.isFunction("string")).toBe(false);
      expect(isType.isFunction(true)).toBe(false);
      expect(isType.isFunction({})).toBe(false);
      expect(isType.isFunction([])).toBe(false);
    });
  });

  describe("isNumber(thing)", function() {
    test("returns true for a Number literal", () => {
      expect(isType.isNumber(42)).toBe(true);
      expect(isType.isNumber(0)).toBe(true);
      expect(isType.isNumber(NaN)).toBe(true);
    });
    test("returns true for a Number instance", () => {
      expect(isType.isNumber(new Number(42.2123))).toBe(true); // eslint-disable-line
      expect(isType.isNumber(new Number())).toBe(true); // eslint-disable-line
      expect(isType.isNumber(Number(0))).toBe(true);
    });
    test("returns false for other things", () => {
      expect(isType.isNumber(new Object())).toBe(false); // eslint-disable-line
      expect(isType.isNumber({})).toBe(false);
      expect(isType.isNumber([0])).toBe(false);
      expect(isType.isNumber(null)).toBe(false);
      expect(isType.isNumber(undefined)).toBe(false);
    });
  });

  describe("isObject()", function() {
    test("returns true with object", function() {
      expect(isType.isObject({})).toBe(true);
    });

    test("returns true with arrays", function() {
      expect(isType.isObject([])).toBe(true);
    });

    test("returns false with non-object", function() {
      expect(isType.isObject(null)).toBe(false);
      expect(isType.isObject(undefined)).toBe(false);
      expect(isType.isObject(NaN)).toBe(false);
      expect(isType.isObject(42)).toBe(false);
      expect(isType.isObject("string")).toBe(false);
      expect(isType.isObject(true)).toBe(false);
      expect(isType.isObject(function() {})).toBe(false);
    });
  });

  describe("isString(thing)", () => {
    test("returns true for a String literal", () => {
      expect(isType.isString("hey")).toBe(true);
      expect(isType.isString("")).toBe(true);
    });
    test("returns true for a String instance", () => {
      expect(isType.isString(new String("hey"))).toBe(true); // eslint-disable-line
      expect(isType.isString(new String(""))).toBe(true); // eslint-disable-line
      expect(isType.isString(String(""))).toBe(true);
    });
    test("returns false for other things", () => {
      expect(isType.isString(new Object())).toBe(false); // eslint-disable-line
      expect(isType.isString({})).toBe(false);
      expect(isType.isString(["string"])).toBe(false);
      expect(isType.isString(0)).toBe(false);
      expect(isType.isString(null)).toBe(false);
      expect(isType.isString(undefined)).toBe(false);
      expect(isType.isString(NaN)).toBe(false);
    });
  });
});
