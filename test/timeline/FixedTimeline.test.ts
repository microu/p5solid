import { expect, test, describe, it } from "vitest";
import { FixedTimeline } from "../../src/timeline/FixedTimeline";

describe("FixedTimeline", function () {
  it("Returns no events if empty", function () {
    const tl = new FixedTimeline([]);
    expect(tl.done());
    expect(tl.run(0).length).toBe(0);
    expect(tl.run(1).length).toBe(0);
    expect(tl.run(10).length).toBe(0);
    expect(tl.run(100).length).toBe(0);
    expect(tl.done());
  });

  it("Returns item events", function () {
    const tl = new FixedTimeline([
      { t: 0, name: "A" },
      { t: 0.9, name: "B", dur: 9 },
      { t: 1, name: "B1" },
      { t: 2, name: "C" },
    ]);
    expect(tl.done()).toBe(false);
    
    let r = tl.run(0);
    expect(r.length).toBe(1);
    expect(r[0].type).toBe("point");
    expect(r[0].item.name).toBe("A");
    expect(tl.done()).toBe(false);
    
    r = tl.run(0.5);
    expect(r.length).toBe(0);
    expect(tl.done()).toBe(false);
    
    r = tl.run(1);
    expect(r.length).toBe(2);
    expect(r[0].type).toBe("frameBegin");
    expect(r[0].item.name).toBe("B");
    expect(r[1].type).toBe("point");
    expect(r[1].item.name).toBe("B1");
    expect(tl.done()).toBe(false);
    
    r = tl.run(1.9);
    expect(r.length).toBe(0);
    expect(tl.done()).toBe(false);
    
    r = tl.run(2);
    expect(r.length).toBe(1);
    expect(r[0].type).toBe("point");
    expect(r[0].item.name).toBe("C");
    expect(tl.done()).toBe(false);
    
    r = tl.run(5);
    expect(r.length).toBe(0);
    expect(tl.done()).toBe(false);

    r = tl.run(10);
    expect(r.length).toBe(1);
    expect(r[0].type).toBe("frameEnd");
    expect(r[0].item.name).toBe("B");
    expect(tl.done()).toBe(true);
    

  });
  // it("", function () {});
});
