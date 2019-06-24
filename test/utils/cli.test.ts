import { cli } from "../../src/utils/cli";

const CURRENT_VERSION = require("../../package.json").version;

describe("cli()", () => {
  it("executes commands and returns results", () => {
    expect.assertions(1);
    return cli("npm version --json --parseable").then((data) => {
      let result = JSON.parse(data.toString());
      expect(result["trackjs-node"]).toBe(CURRENT_VERSION);
    });
  });
});
