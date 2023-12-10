import { describe, test, expect } from "vitest";
import { IValueSegmentData, ValueFunc, ValueSegmentBase } from "@src/segments";

describe("ValueSegmentBase class", function () {
  test("Use linear interpolation", function () {
    const vsb = new ValueSegmentBase({ a: 0, va: 100, b: 10, vb: 200 });

    expect(vsb.v(0)).toBe(100);
    expect(vsb.v(10)).toBe(200);
    checkLinearInterpolation(vsb, vsb.v, 100);
  });
});

function checkLinearInterpolation(
  seg: IValueSegmentData,
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
