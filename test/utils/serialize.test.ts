import { serialize } from "../../src/utils/serialize";

describe("serialize()", () => {
  test("serializes strings", () => {
    expect(serialize("string")).toBe("string");
    expect(serialize("")).toBe("Empty String");
    expect(serialize(new String("a string"))).toBe("a string"); // eslint-disable-line
  });
  test("serializes numbers", () => {
    expect(serialize(42)).toBe("42");
    expect(serialize(0)).toBe("0");
    expect(serialize(NaN)).toBe("NaN");
    expect(serialize(new Number("32.12"))).toBe("32.12"); // eslint-disable-line
  });
  test("serializes booleans", () => {
    expect(serialize(true)).toBe("true");
    expect(serialize(false)).toBe("false");
    expect(serialize(new Boolean("true"))).toBe("true"); // eslint-disable-line
    expect(serialize(new Boolean())).toBe("false"); // eslint-disable-line
  });
  test("serializes falsy types", () => {
    expect(serialize(undefined)).toBe("undefined");
    expect(serialize(null)).toBe("null");
    expect(serialize("")).toBe("Empty String");
    expect(serialize(0)).toBe("0");
    expect(serialize(false)).toBe("false");
    expect(serialize(NaN)).toBe("NaN");
  });
  test("serializes objects", () => {
    expect(serialize({})).toBe("{}");
    expect(serialize({ foo: "bar" })).toBe('{"foo":"bar"}');
    expect(serialize(new Object())) // eslint-disable-line
      .toBe("{}");
  });
  test("serializes functions", () => {
    expect(serialize(function () { })).toBe("function () { }");
    // prettier-ignore
    expect(serialize(function xxx(foo, bar) { return foo + bar; }))
      .toBe("function xxx(foo, bar) { return foo + bar; }");
  });
  test("serializes arrays", () => {
    expect(serialize(["a string", 42, false])).toBe('["a string",42,false]');
    expect(serialize([null, NaN, 0, "", undefined])).toBe('[null,NaN,0,"",undefined]');
    expect(serialize([{ foo: "bar" }])).toBe('[{"foo":"bar"}]');
    expect(serialize([[]])).toBe("[[]]");
    expect(serialize([new Error("test")])).toContain('[{"name":"Error","message":"test","stack":"Error: test');
  });
  test("fallsback to simple serialization for circular references", () => {
    var foo = {
      a: "1",
      b: "2"
    };
    foo["bar"] = foo;
    expect(serialize(foo)).toBe('{"a":"1","b":"2","bar":"[object Object]"}');
  });
  test("serializes Errors", () => {
    var e;
    try {
      throw new Error("oh crap");
    } catch (err) {
      e = err;
    }
    // NOTE [Todd Gardner] The actual stack trace is somewhat unpredictable
    //      inside of Karma/Jasmine, so we just match on the starting characters
    //      for test stability.
    expect(serialize(e)).toContain('{"name":"Error","message":"oh crap","stack":"Error: oh crap');

    expect(serialize(new Error("test"))).toContain('{"name":"Error","message":"test","stack":"Error: test');
  });

  test("serializes symbols", () => {
    expect(serialize(Symbol())).toBe("Symbol()");
    expect(serialize(Symbol("name"))).toBe("Symbol(name)");
    expect(serialize(Symbol(42))).toBe("Symbol(42)");
  });
});
