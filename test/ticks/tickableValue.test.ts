import { expect, test, describe, it } from "vitest";
import { TickableValue } from "../../src/ticks/values";

describe("TickableValue", function () {
  test("New instance", function () {
    const tv = new TickableValue(1);
    expect(tv.started).toBe(false);
    expect(tv.value()).toBe(1);

    tv.tick(0);
    expect(tv.started).toBe(true);
    expect(tv.value()).toBe(1);

    tv.tick(1);
    expect(tv.started).toBe(true);
    expect(tv.value()).toBe(1);
    tv.addTarget({ t: 2, v: 2 });

    tv.tick(1.5);
    expect(tv.started).toBe(true);
    expect(tv.value()).toBe(1.5);

    tv.tick(2);
    expect(tv.started).toBe(true);
    expect(tv.value()).toBe(2);

    tv.tick(10);
    expect(tv.started).toBe(true);
    expect(tv.value()).toBe(2);

    tv.addTarget({t:20, v:3})
    expect(tv.started).toBe(true);
    expect(tv.value()).toBe(2);

    tv.tick(11)
    expect(tv.started).toBe(true);
    expect(tv.value()).toBe(2.1);

    tv.tick(15)
    expect(tv.started).toBe(true);
    expect(tv.value()).toBe(2.5);

    tv.addTarget({t:16, v:3.5})
    expect(tv.value()).toBe(2.5);
    expect(tv.value()).toBe(2.5);
    

    tv.tick(15.5)
    expect(tv.value()).toBe(3);

    tv.tick(16)
    expect(tv.value()).toBe(3.5);

    tv.tick(17)
    expect(tv.value()).toBeLessThan(3.5);

    tv.tick(20)
    expect(tv.value()).toBe(3);

    tv.tick(21)
    expect(tv.value()).toBe(3);

  });
});
