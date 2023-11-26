import { expect, test, describe, it } from "vitest";
import { TimelinePointSequence } from "../../src/timeline/TimelinePointSequence";

describe("TimelinePointSequence class", function () {
  test("Works as expected", function () {
    const seq = new TimelinePointSequence([
      { t: 1, name: "One" },
      { t: 2, name: "Two" },
      { t: 3, name: "Three" },
    ]);

    let [pa, pb, k] = seq.interval(0.5);
    expect(pa.length).toBe(0);
    expect(pb?.name).toBe("One");
    expect(k).toBe(0);

    [pa, pb, k] = seq.interval(1);
    expect(pa[pa.length-1].name).toBe("One");
    expect(pb!.name).toBe("Two");
    expect(k).toBe(0);

    [pa, pb, k] = seq.interval(1.5);
    expect(pa[pa.length-1].name).toBe("One");
    expect(pb!.name).toBe("Two");
    expect(k).toBe(0.5);

    [pa, pb, k] = seq.interval(2);
    expect(pa[pa.length-1].name).toBe("Two");
    expect(pb!.name).toBe("Three");
    expect(k).toBe(0);

    [pa, pb, k] = seq.interval(2.999);
    expect(pa[pa.length-1].name).toBe("Two");
    expect(pb!.name).toBe("Three");
    expect(k).toBeCloseTo(0.999);

    [pa, pb, k] = seq.interval(3);
    expect(pa[pa.length-1].name).toBe("Three");
    expect(pb!).toBeUndefined();
    expect(k).toBeCloseTo(0);

    [pa, pb, k] = seq.interval(3.14);
    expect(pa[pa.length-1].name).toBe("Three");
    expect(pb!).toBeUndefined();
    expect(k).toBeCloseTo(0);
  });
});
