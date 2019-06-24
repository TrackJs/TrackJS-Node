import { uuid } from "../../src/utils/uuid";

describe("uuid()", () => {
  it("generates a uuid string", () => {
    expect(uuid()).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/);
  });
  // it('generates unique uuids', () => {
  //   let set = new Set();
  //   for(var idx = 0; idx <= 1000; idx++) {
  //     let id = uuid();
  //     expect(set.has(id)).toBe(false);
  //     set.add(id);
  //   }
  // });
});
