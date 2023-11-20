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
      { t: 1, name: "B0", dur: 9 },
      { t: 1, name: "B1", dur: 1.9 },
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
    expect(r[0].item.name).toBe("B0");
    expect(r[1].type).toBe("frameBegin");
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
    expect(r.length).toBe(1);
    expect(r[0].type).toBe("frameEnd");
    expect(r[0].item.name).toBe("B1");
    expect(tl.done()).toBe(false);

    r = tl.run(10);
    expect(r.length).toBe(1);
    expect(r[0].type).toBe("frameEnd");
    expect(r[0].item.name).toBe("B0");
    expect(tl.done()).toBe(true);
  });

  it("Returns active frames", function () {
    const tl = new FixedTimeline([
      { t: 0, name: "A" },
      { t: 2.5, name: "B" },
      { t: 5, name: "C" },
      { t: 0, name: "FA", dur: 5 },
      { t: 1, name: "FB", dur: 2 },
      { t: 2, name: "FC", dur: 1 },
    ]);

    expect(tl.activeFrames.length).toBe(0);
    expect(tl.done()).toBe(false);
    
    tl.run(0);
    let frames = tl.activeFrames;
    expect(frames.length).toBe(1);
    expect(frames[0].name).toBe("FA");
    expect(tl.done()).toBe(false)

    tl.run(0.5);
    frames = tl.activeFrames;
    expect(frames.length).toBe(1);
    expect(frames[0].name).toBe("FA");
    expect(tl.done()).toBe(false)
    
    tl.run(1);
    frames = tl.activeFrames;
    expect(frames.length).toBe(2);
    expect(frames[0].name).toBe("FA");
    expect(frames[1].name).toBe("FB");
    expect(tl.done()).toBe(false)
    
    tl.run(1.5);
    frames = tl.activeFrames;
    expect(frames.length).toBe(2);
    expect(frames[0].name).toBe("FA");
    expect(frames[1].name).toBe("FB");
    expect(tl.done()).toBe(false)
    
    tl.run(2);
    frames = tl.activeFrames;
    expect(frames.length).toBe(3);
    expect(frames[0].name).toBe("FA");
    expect(frames[1].name).toBe("FB");
    expect(frames[2].name).toBe("FC");
    expect(tl.done()).toBe(false)
    
    tl.run(2.5);
    frames = tl.activeFrames;
    expect(frames.length).toBe(3);
    expect(frames[0].name).toBe("FA");
    expect(frames[1].name).toBe("FB");
    expect(frames[2].name).toBe("FC");
    expect(tl.done()).toBe(false)
    
    tl.run(3);
    frames = tl.activeFrames;
    expect(frames.length).toBe(1);
    expect(frames[0].name).toBe("FA");
    expect(tl.done()).toBe(false)
    
    tl.run(4);
    frames = tl.activeFrames;
    expect(frames.length).toBe(1);
    expect(frames[0].name).toBe("FA");
    expect(tl.done()).toBe(false)

    tl.run(5);
    frames = tl.activeFrames;
    expect(frames.length).toBe(0);

    expect(tl.done()).toBe(true)

  });
});
