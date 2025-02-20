import { nestedAssign } from "../../src/utils/nestedAssign";

describe("nestedAssign()", () => {
  it("assigns properties from objects", () => {
    const a = { foo: "foo" };
    const b = { bar: "bar" };
    const c = { foo: "baz" };
    const result = nestedAssign({}, a, b, c);
    expect(result).not.toBe(a);
    expect(result).not.toBe(b);
    expect(result).not.toBe(c);
    expect(result).toEqual({
      foo: "baz",
      bar: "bar"
    });
  });

  it("assigns nested properties from objects when always provided", () => {
    const a = { foo: "foo", nested: { bar: "bar", baz: "baz" } };
    const b = { foo: "zzz", nested: { bar: "xxx", baz: "yyy" } };
    const result = nestedAssign({}, a, b);
    expect(result).toEqual({
      foo: "zzz",
      nested: {
        bar: "xxx",
        baz: "yyy"
      }
    });
  });

  it("assigns nested properties from objects when not provided", () => {
    const a = { foo: "foo", nested: { bar: "bar", baz: "baz" } };
    const b = { foo: "zzz" };
    const result = nestedAssign({}, a, b);
    expect(result).toEqual({
      foo: "zzz",
      nested: {
        bar: "bar",
        baz: "baz"
      }
    });
  });

  it("assigns nested properties from objects when partial provided", () => {
    const a = { foo: "foo", nested: { bar: "bar", baz: "baz" } };
    const b = { foo: "zzz", nested: { baz: "xxx" } };
    const result = nestedAssign({}, a, b);
    expect(result).toEqual({
      foo: "zzz",
      nested: {
        bar: "bar",
        baz: "xxx"
      }
    });
  });

  it("doesn't manipulate the sources", () => {
    const a = { foo: "foo", nested: { bar: "bar", baz: "baz" } };
    const b = { foo: "zzz", nested: { baz: "xxx" } };
    const result = nestedAssign({}, a, b);
    expect(a).toEqual({ foo: "foo", nested: { bar: "bar", baz: "baz" } });
    expect(b).toEqual({ foo: "zzz", nested: { baz: "xxx" } });
  });
});
