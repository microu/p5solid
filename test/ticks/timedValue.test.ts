import { expect, test, describe, it } from "vitest";
import { TimedValue } from "../../src/ticks/TimedValue";

describe("Timed value", function () {
  test("Basic usage with numbers", function () {
    const tv = new TimedValue([
      { t: 2, v: 200 },
      { t: 3, v: 400 },
      { t: 1, v: 100 },
    ]);

    expect(tv.v(0)).toBe(100);
    expect(tv.v(3.1)).toBe(400);

    expect(tv.v(1)).toBe(100);
    expect(tv.v(2)).toBe(200);
    expect(tv.v(3)).toBe(400);

    expect(tv.v(1.1)).toBeCloseTo(110);
    expect(tv.v(1.5)).toBeCloseTo(150);

    expect(tv.v(2.5)).toBeCloseTo(300);
    expect(tv.v(2.75)).toBeCloseTo(350);
  });

  test("Basic usage with strings", function () {
    const tv = new TimedValue([
      { t: 10, v: "ten" },
      { t: 3, v: "three" },
      { t: 2, v: "two" },
      { t: 1, v: "one" },
    ]);

    expect(tv.v(0)).toBe("one");
    expect(tv.v(1)).toBe("one");
    expect(tv.v(2)).toBe("two");
    expect(tv.v(3)).toBe("three");
    expect(tv.v(10)).toBe("ten");
    expect(tv.v(100)).toBe("ten");

    expect(tv.v(1.4)).toBe("one");
    expect(tv.v(1.6)).toBe("two");
    expect(tv.v(2.51)).toBe("three");
    expect(tv.v(4)).toBe("three");
    expect(tv.v(5)).toBe("three");
    expect(tv.v(6)).toBe("three");
    expect(tv.v(7)).toBe("ten");
    expect(tv.v(8)).toBe("ten");
    expect(tv.v(9)).toBe("ten");
  });
});
