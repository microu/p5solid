import { expect, test, describe, it } from "vitest";
import { ClockBase } from "../../src/ticks";

describe("New ClockBase", function () {
  const cb1 = new ClockBase();
  const cb2 = new ClockBase({tick0:1000});
  it("is not started and not paused", function () {
    expect(cb1.started).toBe(false);
    expect(cb1.paused).toBe(false);
    expect(cb2.started).toBe(false);
    expect(cb2.paused).toBe(false);
  });

  it("is started after tick0", function () {
    cb1.tick(0)
    expect(cb1.started).toBe(true);
    expect(cb1.paused).toBe(false);
    expect(cb1.t).toBe(0)
    
    cb2.tick(0)
    expect(cb2.started).toBe(false);
    expect(cb2.paused).toBe(false);

    cb2.tick(1100)
    expect(cb2.started).toBe(true);
    expect(cb2.paused).toBe(false);
    expect(cb2.t).toBe(100);

  });
});

describe("Running ClockBase", function () {

  test("simple scale", function() {
    const cb = new ClockBase({scale:10})

    expect(cb.started).toBe(false)
    expect(cb.paused).toBe(false)

    cb.tick(1000)
    expect(cb.started).toBe(true)
    expect(cb.t).toBe(0)

    cb.tick(1001)
    expect(cb.started).toBe(true)
    expect(cb.t).toBe(10)
 
    cb.tick(1001.1)
    expect(cb.started).toBe(true)
    expect(cb.t).toBeCloseTo(11)

    cb.tick(1010)
    expect(cb.started).toBe(true)
    expect(cb.t).toBeCloseTo(100)


  })
})
