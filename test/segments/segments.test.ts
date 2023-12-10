import { describe, test, expect } from "vitest";
import { SegmentBase } from "../../src/segments";

describe("SegmentBase class", function () {
  test("[a,b[ usage", function () {
    const seg = new SegmentBase(1, 2);

    expect(seg.a).toBe(1);
    expect(seg.aClosed).toBe(true);
    expect(seg.contains(1)).toBe(true);
    expect(seg.b).toBe(2);
    expect(seg.bClosed).toBe(false);
    expect(seg.contains(2)).toBe(false);

    for (let i = 0; i < 10; i++) {
      expect(seg.contains(1 + i / 10)).toBe(true);
    }
    for (let i = 0; i < 10; i++) {
      expect(seg.contains(2 + i)).toBe(false);
    }
    for (let i = 1; i <= 10; i++) {
      expect(seg.contains(1 - i)).toBe(false);
    }
    expect(seg.contains(Infinity)).toBe(false);
    expect(seg.contains(-Infinity)).toBe(false);
  });

  test("[a,b] usage", function () {
    const seg = new SegmentBase({ a: 1, b: 2, aClosed: true, bClosed: true });

    expect(seg.a).toBe(1);
    expect(seg.aClosed).toBe(true);
    expect(seg.contains(1)).toBe(true);
    expect(seg.b).toBe(2);
    expect(seg.bClosed).toBe(true);
    expect(seg.contains(2)).toBe(true);

    for (let i = 0; i <= 10; i++) {
      expect(seg.contains(1 + i / 10)).toBe(true);
    }
    for (let i = 1; i <= 10; i++) {
      expect(seg.contains(2 + i)).toBe(false);
    }
    for (let i = 1; i <= 10; i++) {
      expect(seg.contains(1 - i)).toBe(false);
    }
    expect(seg.contains(Infinity)).toBe(false);
    expect(seg.contains(-Infinity)).toBe(false);
  });

  test("]a,b] usage", function () {
    const seg = new SegmentBase({ a: 1, b: 2, aClosed: false, bClosed: true });

    expect(seg.a).toBe(1);
    expect(seg.aClosed).toBe(false);
    expect(seg.contains(1)).toBe(false);
    expect(seg.b).toBe(2);
    expect(seg.bClosed).toBe(true);
    expect(seg.contains(2)).toBe(true);

    for (let i = 1; i <= 10; i++) {
      expect(seg.contains(1 + i / 10)).toBe(true);
    }
    for (let i = 1; i <= 10; i++) {
      expect(seg.contains(2 + i)).toBe(false);
    }
    for (let i = 0; i <= 10; i++) {
      expect(seg.contains(1 - i)).toBe(false);
    }
    expect(seg.contains(Infinity)).toBe(false);
    expect(seg.contains(-Infinity)).toBe(false);
  });

  test("]a,b[ usage", function () {
    const seg = new SegmentBase({ a: 1, b: 2, aClosed: false, bClosed: false });

    expect(seg.a).toBe(1);
    expect(seg.aClosed).toBe(false);
    expect(seg.contains(1)).toBe(false);
    expect(seg.b).toBe(2);
    expect(seg.bClosed).toBe(false);
    expect(seg.contains(2)).toBe(false);

    for (let i = 1; i < 10; i++) {
      expect(seg.contains(1 + i / 10)).toBe(true);
    }
    for (let i = 0; i <= 10; i++) {
      expect(seg.contains(2 + i)).toBe(false);
    }
    for (let i = 0; i <= 10; i++) {
      expect(seg.contains(1 - i)).toBe(false);
    }
    expect(seg.contains(Infinity)).toBe(false);
    expect(seg.contains(-Infinity)).toBe(false);
  });
});
