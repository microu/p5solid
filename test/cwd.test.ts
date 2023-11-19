import process from "node:process";
import { expect, test, describe, it } from "vitest";
describe("process.cwd", function () {
  it("Returns the current working directory", function () {
    expect(process.cwd().endsWith("p5solid"));
  });
});
