import { expect, test, describe, it } from "vitest";
import { ClockBase } from "../../src/ticks";

describe("New ClockBase", function () {
  const cb1 = new ClockBase();
  const cb2 = new ClockBase({ tick0: 1000 });
  it("is not started and not paused", function () {
    expect(cb1.started).toBe(false);
    expect(cb1.paused).toBe(false);
    expect(cb2.started).toBe(false);
    expect(cb2.paused).toBe(false);
  });

  it("is started after tick0", function () {
    cb1.tick(0);
    expect(cb1.started).toBe(true);
    expect(cb1.paused).toBe(false);
    expect(cb1.t).toBe(0);

    cb2.tick(0);
    expect(cb2.started).toBe(false);
    expect(cb2.paused).toBe(false);

    cb2.tick(1100);
    expect(cb2.started).toBe(true);
    expect(cb2.paused).toBe(false);
    expect(cb2.t).toBe(100);
  });
});

describe("Running ClockBase", function () {
  test("ClockBase with option scale", function () {
    const cb = new ClockBase({ scale: 10 });

    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);

    cb.tick(1000);
    expect(cb.started).toBe(true);
    expect(cb.t).toBe(0);

    cb.tick(1001);
    expect(cb.started).toBe(true);
    expect(cb.t).toBe(10);

    cb.tick(1001.1);
    expect(cb.started).toBe(true);
    expect(cb.t).toBeCloseTo(11);

    cb.tick(1010);
    expect(cb.started).toBe(true);
    expect(cb.t).toBeCloseTo(100);
  });

  test("ClockBase with option tick0", function () {
    const cb = new ClockBase({ tick0: 10000 });

    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0);

    cb.tick(0);
    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0);

    cb.tick(5000);
    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0);

    cb.tick(9000);
    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0);

    cb.tick(9999);
    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0);

    cb.tick(10000);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0);

    cb.tick(10010);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(10);

    cb.tick(20000);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(10000);
  });

  test("ClockBase with option t0", function () {
    const cb = new ClockBase({ t0: 1000 });

    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0);

    cb.tick(0);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(1000);

    cb.tick(1);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(1001);

    cb.tick(5000);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(6000);

    cb.tick(20000);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(21000);
  });

  test("ClockBase with options t0, tick0 adnd scale", function () {
    const cb = new ClockBase({ tick0: 100, t0: 1000, scale: 2 });

    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0);

    cb.tick(0);
    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0);

    cb.tick(99.9);
    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0);

    cb.tick(101);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(1002);

    cb.tick(102);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(1004);

    cb.tick(110);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(1020);

    cb.tick(300);
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(1400);
  });
});

describe("Running/pausing ClockBase", function () {
  test("Basic run pause", function () {
    const cb = new ClockBase();
    expect(cb.started).toBe(false);
    expect(cb.paused).toBe(false);

    cb.tick(1000)
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(0)

    cb.tick(2000)
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(1000)

    cb.paused = true
    
    cb.tick(3000)
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(true);
    expect(cb.t).toBe(1000)
    
    cb.tick(3500)
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(true);
    expect(cb.t).toBe(1000)
    
    cb.tick(3999)
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(true);
    expect(cb.t).toBe(1000)
    
    cb.paused = false;
    console.log("PAUSED?", cb.state)
    
    cb.tick(4000)
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(1000)

    cb.tick(5000)
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(2000)

    // pausing unpausing between 2 ticks as no effect
    cb.paused = true
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(true);
    expect(cb.t).toBe(2000)

    cb.paused = false
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(2000)

    cb.tick(6000)
    expect(cb.started).toBe(true);
    expect(cb.paused).toBe(false);
    expect(cb.t).toBe(3000)


  });
});
