import { describe, test, expect } from "vitest";
import { easeSinInOut } from "d3-ease";

import {
  IValueSegmentData,
  InterpolateSegment,
  ValueFunc,
  SegmentedValue,
  normalizeSegmentArg,
} from "@src/segments";

describe("InterpolateSegment class", function () {
  test("Use linear interpolation", function () {
    const vsb = new InterpolateSegment({ a: 0, va: 100, b: 10, vb: 200 });

    expect(vsb.v(0)).toBe(100);
    expect(vsb.v(10)).toBe(200);
    checkLinearInterpolation(vsb, (t) => vsb.v(t), 100);
  });

  test("Use SinInOut easing", function () {
    const vsb = new InterpolateSegment(
      { a: 0, va: 100, b: 1, vb: 1000 },
      { easing: easeSinInOut }
    );

    expect(vsb.v(0)).toBe(100);
    expect(vsb.v(1)).toBe(1000);

    checkSinInOutInterpolation(vsb, (t) => vsb.v(t));
  });

  test("Use nearest interpolation", function () {
    const vsb = new InterpolateSegment({ a: 0, va: "Zero", b: 10, vb: "Ten" });
    expect(vsb.v(0)).toBe("Zero");
    expect(vsb.v(1)).toBe("Zero");
    expect(vsb.v(4.9)).toBe("Zero");
    expect(vsb.v(5.1)).toBe("Ten");
    expect(vsb.v(9)).toBe("Ten");
    expect(vsb.v(10)).toBe("Ten");

    expect(vsb.v(-10)).toBe("Zero");
    expect(vsb.v(-100)).toBe("Zero");
    expect(vsb.v(20)).toBe("Ten");
    expect(vsb.v(200)).toBe("Ten");
  });
});

describe("SegmentedValue class", function () {
  test("Simple usage", function () {
    const sv = new SegmentedValue([
      new InterpolateSegment({ a: 10, va: 0, b: 20, vb: 100 }),
      new InterpolateSegment(
        { a: 100, va: 100, b: 120, vb: 200 },
        { easing: easeSinInOut }
      ),
    ]);

    expect(sv.a).toBe(10);
    expect(sv.b).toBe(120);
    expect(sv.va).toBe(0);
    expect(sv.vb).toBe(200);

    expect(sv.v(15)).toBe(50);
    checkLinearInterpolation(
      { a: 10, va: 0, b: 20, vb: 100, aClosed: true, bClosed: false },
      (t) => sv.v(t)
    );
    expect(sv.v(110)).toBe(150);
    checkSinInOutInterpolation(
      { a: 100, va: 100, b: 120, vb: 200, aClosed: true, bClosed: false },
      (t) => sv.v(t)
    );

    expect(sv.v(20)).toBe(100);
    expect(sv.v(30)).toBe(100);
    expect(sv.v(99)).toBe(100);

    expect(sv.v(0)).toBe(-100);
    expect(sv.v(140)).toBe(100);
    expect(sv.v(160)).toBe(200);
    expect(sv.v(180)).toBe(100);
    expect(sv.v(200)).toBe(200);
  });
});

function checkLinearInterpolation(
  seg: IValueSegmentData<number>,
  f: ValueFunc,
  n = 10
) {
  for (let i = 0; i <= n; i += 1) {
    const k = i / n;
    const t = seg.a + k * (seg.b - seg.a);
    const v = f(t);
    expect(v).toBeCloseTo(seg.va + k * (seg.vb - seg.va));
  }
}

function checkSinInOutInterpolation(
  seg: IValueSegmentData<number>,
  f: ValueFunc,
  nChecks = 10
) {
  expect(f(seg.a)).toBe(seg.va);
  expect(f(seg.b)).toBe(seg.vb);

  const m = { t: (seg.a + seg.b) / 2, v: (seg.va + seg.vb) / 2 };
  console.log("M:", m);
  expect(f(m.t)).toBeCloseTo(m.v);

  // first half below linear interpolation
  for (let i = 1; i <= nChecks; i += 1) {
    const k = i / (nChecks + 1);
    const t = seg.a + k * (m.t - seg.a);
    const linearv = seg.va + k * (m.v - seg.va);
    expect(f(t)).toBeLessThan(linearv);
  }

  // fsecond half above linear interpolation
  for (let i = 1; i <= nChecks; i += 1) {
    const k = i / (nChecks + 1);
    const t = m.t + k * (seg.b - m.t);
    const linearv = m.v + k * (seg.vb - m.v);
    expect(f(t)).toBeGreaterThan(linearv);
  }
}
