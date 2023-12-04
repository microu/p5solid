import { expect, test, describe, it } from "vitest";
import { IKeyPoint, TimedValue } from "../../src/ticks/TimedValue";

describe("Timed value", function () {
  test("Basic usage with numbers", function () {
    const tv = new TimedValue([
      { t: 2, v: 200 },
      { t: 3, v: 400 },
      { t: 1, v: 100 },
    ]);

    checkLinearInterpolation(tv, { t: 1, v: 100 }, { t: 2, v: 200 });
    checkLinearInterpolation(tv, { t: 2, v: 200 }, { t: 3, v: 400 });
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

  function sinInOutInterpolator(a: number, b: number, k: number): number {
    const theta = -Math.PI / 2 + k * Math.PI;
    const kk = (1 + Math.sin(theta)) / 2;
    return a + kk * (b - a);
  }

  test("Basic usage with custom interpolator", function () {
    const keyPoints = [
      { t: 1, v: 0 },
      { t: 2, v: 500 },
      { t: 3, v: 600 },
      { t: 10, v: 700 },
    ];
    const tv = new TimedValue(keyPoints, sinInOutInterpolator);

    expect(tv.v(-1)).toBe(0);
    expect(tv.v(1)).toBe(0);
    expect(tv.v(2)).toBe(500);
    expect(tv.v(3)).toBe(600);
    expect(tv.v(10)).toBe(700);
    expect(tv.v(100)).toBe(700);

    checkSinInOutInterpolation(tv, keyPoints[0], keyPoints[1], 10_000);
    checkSinInOutInterpolation(tv, keyPoints[1], keyPoints[2], 100);
    checkSinInOutInterpolation(tv, keyPoints[2], keyPoints[3]);
  });

  test("Basic usage with custom interpolator at a given checkpoint", function () {
    const keyPoints = [
      { t: 1, v: 30 },
      { t: 11, v: 500, interpolator: sinInOutInterpolator },
      { t: 111, v: 600 },
      { t: 1111, v: 700 },
    ];
    const tv = new TimedValue(keyPoints);
    checkLinearInterpolation(tv, keyPoints[0], keyPoints[1], 1000);
    checkSinInOutInterpolation(tv, keyPoints[1], keyPoints[2], 1000);
    checkLinearInterpolation(tv, keyPoints[2], keyPoints[3], 1000);
  });
});

function checkSinInOutInterpolation(
  tv: TimedValue<number>,
  a: IKeyPoint<number>,
  b: IKeyPoint<number>,
  nChecks = 10
) {
  expect(tv.v(a.t)).toBe(a.v);
  expect(tv.v(b.t)).toBe(b.v);

  const m = { t: (a.t + b.t) / 2, v: (a.v + b.v) / 2 };
  expect(tv.v(m.t)).toBeCloseTo(m.v);
  // first half below linear interpolation
  for (let i = 1; i <= nChecks; i += 1) {
    const k = i / (nChecks + 1);
    const t = a.t + k * (m.t - a.t);
    const linearv = a.v + k * (m.v - a.v);
    expect(tv.v(t)).toBeLessThan(linearv);
  }

  // fsecond half above linear interpolation
  for (let i = 1; i <= nChecks; i += 1) {
    const k = i / (nChecks + 1);
    const t = m.t + k * (b.t - m.t);
    const linearv = m.v + k * (b.v - m.v);
    expect(tv.v(t)).toBeGreaterThan(linearv);
  }
}

function checkLinearInterpolation(
  tv: TimedValue<number>,
  a: IKeyPoint<number>,
  b: IKeyPoint<number>,
  nChecks = 20
) {
  expect(tv.v(a.t)).toBe(a.v);
  expect(tv.v(b.t)).toBe(b.v);

  const m = { t: (a.t + b.t) / 2, v: (a.v + b.v) / 2 };
  expect(tv.v(m.t)).toBeCloseTo(m.v);

  // first half below linear interpolation
  for (let i = 1; i <= nChecks; i += 1) {
    const k = i / (nChecks + 1);
    const t = a.t + k * (b.t - a.t);
    const linearv = a.v + k * (b.v - a.v);
    expect(tv.v(t)).toBeCloseTo(linearv);
  }
}
