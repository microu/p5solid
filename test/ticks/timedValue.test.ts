import { expect, test, describe, it } from "vitest";
import { TimedValue } from "../../src/ticks/TimedValue";

describe("Timed value", function () {
  test("Basic usage", function () {
    const tv = new TimedValue([
      { t: 2, v: 200 },
      { t: 3, v: 400 },
      { t: 1, v: 100 },
    ]);

    expect(tv.v(0)).toBe(100)
    expect(tv.v(3.1)).toBe(400)
    
    expect(tv.v(1)).toBe(100)
    expect(tv.v(2)).toBe(200)
    expect(tv.v(3)).toBe(400)

    expect(tv.v(1.1)).toBeCloseTo(110)
    expect(tv.v(1.5)).toBeCloseTo(150)

    expect(tv.v(2.5)).toBeCloseTo(300)
    expect(tv.v(2.75)).toBeCloseTo(350)



  });
});
