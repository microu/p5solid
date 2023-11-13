import { cp, IContextParams, ContextParamsBase } from "../../src/context/values";
import { expect, test, it, describe } from "vitest";

function f(x: () => any): () => any {
  return x;
}

describe("cv function", function () {
  const context = new ContextParamsBase();
  context.set("a", 11);
  context.set("b", 22);
  context.set(
    "c",
    (ctx) => (ctx.get("a") as number) + (ctx.get("b") as number)
  );

  it("Returns values as is", () => {
    expect(cp(context, 33)).toBe(33);
    expect(cp(context, "abc")).toBe("abc");
  });

  it("Calls value function if needed", () => {
    expect(cp(context, () => "XYZ")).toBe("XYZ");
    expect(cp(context, () => 111)).toBe(111);
  });

  it("Can use context values", () => {
    expect(cp(context, (ctx) => ctx.get("a"))).toBe(11);
    expect(cp(context, (ctx) => ctx.get("b"))).toBe(22);
    expect(cp(context, (ctx) => ctx.get("c"))).toBe(33);
    expect(cp(context, (ctx) => ctx.get("d"))).toBe(undefined);
  });
});

class TimeContext implements IContextParams<number> {
  t: number = 0;
  get(name: string): number | undefined {
    return name == "t" ? this.t : undefined;
  }
}

describe("Time context", function () {
  it("Returns time value for 't' key", function () {
    const tctx = new TimeContext();
    expect(tctx.get("t")).toBe(0);
    tctx.t = 99;
    expect(tctx.get("t")).toBe(99);
  });

  it("Returns undefined for any other key", function () {
    const tctx = new TimeContext();
    expect(tctx.get("a")).toBe(undefined);
    expect(tctx.get("b")).toBe(undefined);
    expect(tctx.get("")).toBe(undefined);
  });

  it("Provides 't' for child contextes", function () {
    const tctx = new TimeContext();
    tctx.t = 421;
    const context = new ContextParamsBase(tctx);
    expect(context.get("t")).toBe(421);
    expect(context.get("tt")).toBe(undefined);
    tctx.t += 1;
    expect(context.get("t")).toBe(422);
    expect(context.get("tt")).toBe(undefined);
  });
});
