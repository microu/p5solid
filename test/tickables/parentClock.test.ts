import { expect, test, describe, it } from "vitest";
import { ParentClock } from "../../src/ticks";

describe("ParentClock instance", function () {
  it("Is not started until first tick() call", function () {
    const pc = new ParentClock();
    expect(pc.started).toBe(false);

    pc.tick(1000, 10);
    expect(pc.started).toBe(true);
    expect(pc.t).toBe(0);
    expect(pc.dt).toBe(0);

    const pcb = new ParentClock({ t0: 5000 });
    expect(pcb.started).toBe(false);

    pcb.tick(1000, 10);
    expect(pcb.started).toBe(false);

    pcb.tick(5000, 10);
    expect(pcb.started).toBe(true);
    expect(pcb.t).toBe(0);
    expect(pcb.dt).toBe(0);


  });
});
