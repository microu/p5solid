import { expect, test, describe } from "vitest";
import { ClockBase, ParentClock } from "@src/tickables";

describe("ParentClock instance", function () {
  test("No options => default options", function () {
    const pc = new ParentClock();
    expect(pc.started).toBe(false);

    pc.tick(1000);
    expect(pc.started).toBe(true);
    expect(pc.t).toBe(0);

    pc.tick(1100);
    expect(pc.started).toBe(true);
    expect(pc.t).toBe(100);

    pc.tick(1150);
    expect(pc.started).toBe(true);
    expect(pc.t).toBe(150);
  });

  test("With tick0 option", function () {
    const pc = new ParentClock({ tick0: 5000 });
    expect(pc.started).toBe(false);

    pc.tick(1000);
    expect(pc.started).toBe(false);

    pc.tick(5000);
    expect(pc.started).toBe(true);
    expect(pc.t).toBe(0);
  });

  test("With scale option", function () {
    const pc = new ParentClock({ scale: 1 / 1000 });
    expect(pc.started).toBe(false);

    pc.tick(1000);
    expect(pc.started).toBe(true);
    expect(pc.t).toBe(0);

    pc.tick(1100);
    expect(pc.started).toBe(true);
    expect(pc.t).toBe(0.1);

    for (let i = 2; i < 1_000; i += 1) {
      pc.tick(i * 1000);
      expect(pc.started).toBe(true);
      expect(pc.t).toBe(i - 1);

      pc.tick(i * 1000 + 100);
      expect(pc.started).toBe(true);
      expect(pc.t).toBeCloseTo(i - 1 + 0.1);
    }
  });

  test("Children update", function () {
    const pc = new ParentClock();
    const cc1 = new ClockBase({ scale: 1 / 10 });
    const cc2 = new ClockBase({ tick0: 2000, scale: 1 / 1000 });
    
    pc.addChild(cc1);
    pc.addChild(cc2);

    expect(pc.started).toBe(false);
    expect(cc1.started).toBe(false);
    expect(cc2.started).toBe(false);

    pc.tick(0);
    expect(pc.started).toBe(true);
    expect(cc1.started).toBe(true);
    expect(cc2.started).toBe(false);
    expect(pc.t).toBe(0);
    expect(cc1.t).toBe(0);
    expect(cc2.t).toBe(0);

    pc.tick(1000);
    expect(pc.started).toBe(true);
    expect(cc1.started).toBe(true);
    expect(cc2.started).toBe(false);
    expect(pc.t).toBe(1000);
    expect(cc1.t).toBe(100);
    expect(cc2.t).toBe(0);

    pc.tick(2000);
    expect(pc.started).toBe(true);
    expect(cc1.started).toBe(true);
    expect(cc2.started).toBe(true);
    expect(pc.t).toBe(2000);
    expect(cc1.t).toBe(200);
    expect(cc2.t).toBe(0);

    pc.tick(3000);
    expect(pc.started).toBe(true);
    expect(cc1.started).toBe(true);
    expect(cc2.started).toBe(true);
    expect(pc.t).toBe(3000);
    expect(cc1.t).toBe(300);
    expect(cc2.t).toBe(1);
  });
});
