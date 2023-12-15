import { expect, test, describe, it } from "vitest";
import { IKeyPoint, PVInterpolate, sinInOutInterpolator } from "@src/pvalue";

describe("Timed value", function () {
  test("Basic usage with numbers", function () {
    const tv = new PVInterpolate([
      { t: 2, v: 200 },
      { t: 3, v: 400 },
      { t: 1, v: 100 },
    ]);

    checkLinearInterpolation(tv, { t: 1, v: 100 }, { t: 2, v: 200 });
    checkLinearInterpolation(tv, { t: 2, v: 200 }, { t: 3, v: 400 });

    // extrapolate
    expect(tv.v(0.5)).toBe(50)
    expect(tv.v(4)).toBe(600)
    
  });

  test("Basic usage with strings", function () {
    const tv = new PVInterpolate([
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

  test("Basic usage with custom interpolator", function () {
    const keyPoints = [
      { t: 1, v: 0 },
      { t: 2, v: 500 },
      { t: 3, v: 600 },
      { t: 10, v: 700 },
    ];
    const tv = new PVInterpolate(keyPoints, {
      interpolator: sinInOutInterpolator,
    });

    expect(tv.v(-1)).toBe(0);
    expect(tv.v(1)).toBe(0);
    expect(tv.v(2)).toBe(500);
    expect(tv.v(3)).toBe(600);
    expect(tv.v(10)).toBe(700);
    expect(tv.v(17)).toBe(600);

    checkSinInOutInterpolation(tv, keyPoints[0], keyPoints[1], 1000);
    checkSinInOutInterpolation(tv, keyPoints[1], keyPoints[2], 100);
    checkSinInOutInterpolation(tv, keyPoints[2], keyPoints[3]);
  });

  // test("Basic usage with custom easing at a given checkpoint", function () {
  //   const keyPoints = [
  //     { t: 1, v: 30 },
  //     { t: 11, v: 500, easing: d3ease.easeSinInOut },
  //     { t: 111, v: 600 },
  //     { t: 1111, v: 700 },
  //   ];
  //   const tv = new PVInterpolate(keyPoints);
  //   checkLinearInterpolation(tv, keyPoints[0], keyPoints[1], 1000);
  //   checkSinInOutInterpolation(tv, keyPoints[1], keyPoints[2], 1000);
  //   checkLinearInterpolation(tv, keyPoints[2], keyPoints[3], 1000);
  // });

  test("addKeyPoint method - add in an interval", function () {
    const keyPoints = [
      { t: 10, v: 100 },
      { t: 20, v: 0 },
      { t: 30, v: 200 },
      { t: 40, v: 300 },
    ];
    let tv = new PVInterpolate(keyPoints);
    checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
    checkLinearInterpolation(tv, keyPoints[1], keyPoints[2]);
    checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);

    tv.addKeyPoint({ t: 25, v: 400 });
    checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
    checkLinearInterpolation(tv, keyPoints[1], { t: 25, v: 400 });
    checkLinearInterpolation(tv, { t: 25, v: 400 }, keyPoints[2]);
    checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);
  });

  test("addKeyPoint method - add at end", function () {
    const keyPoints = [
      { t: 10, v: 100 },
      { t: 20, v: 0 },
      { t: 30, v: 200 },
      { t: 40, v: 300 },
    ];
    let tv = new PVInterpolate(keyPoints);
    checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
    checkLinearInterpolation(tv, keyPoints[1], keyPoints[2]);
    checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);

    tv.addKeyPoint({ t: 50, v: 500 });
    checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
    checkLinearInterpolation(tv, keyPoints[1], keyPoints[2]);
    checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);
    checkLinearInterpolation(tv, keyPoints[3], { t: 50, v: 500 });
    expect(tv.v(50)).toBe(500);
    expect(tv.v(60)).toBe(700);
  });

  test("addKeyPoint method - add at begining", function () {
    const keyPoints = [
      { t: 10, v: 100 },
      { t: 20, v: 0 },
      { t: 30, v: 200 },
      { t: 40, v: 300 },
    ];
    let tv = new PVInterpolate(keyPoints);
    checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
    checkLinearInterpolation(tv, keyPoints[1], keyPoints[2]);
    checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);

    tv.addKeyPoint({ t: 0, v: 10 });
    expect(tv.v(-20)).toBe(-170);
    expect(tv.v(-10)).toBe(-80);
    checkLinearInterpolation(tv, { t: 0, v: 10 }, keyPoints[0]);
    checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
    checkLinearInterpolation(tv, keyPoints[1], keyPoints[2]);
    checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);
  });

  //   test("insertKeyPoint method - changes nothing with linear interpolation", function () {
  //     const keyPoints = [
  //       { t: 10, v: 100 },
  //       { t: 20, v: 0 },
  //       { t: 30, v: 200 },
  //       { t: 40, v: 300 },
  //     ];

  //     const tv = new PVInterpolate(keyPoints);
  //     expect(tv.v(0)).toBe(100);
  //     checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
  //     checkLinearInterpolation(tv, keyPoints[1], keyPoints[2]);
  //     checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);
  //     expect(tv.v(100)).toBe(300);

  //     tv.insertKeyPoint({ t: 5 });
  //     tv.insertKeyPoint({ t: 15 });
  //     tv.insertKeyPoint({ t: 25 });
  //     tv.insertKeyPoint({ t: 35 });
  //     tv.insertKeyPoint({ t: 45 });

  //     expect(tv.v(0)).toBe(100);
  //     checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
  //     checkLinearInterpolation(tv, keyPoints[1], keyPoints[2]);
  //     checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);
  //     expect(tv.v(100)).toBe(300);
  //   });

  //   test("insertKeyPoint method - fix value at a given time + add keypoint after", function () {
  //     const keyPoints = [
  //       { t: 10, v: 1 },
  //       { t: 20, v: 3 },
  //       { t: 30, v: 5 },
  //       { t: 40, v: 7 },
  //     ];

  //     const tv = new PVInterpolate(keyPoints);
  //     expect(tv.v(0)).toBe(1);
  //     checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
  //     checkLinearInterpolation(tv, keyPoints[1], keyPoints[2]);
  //     checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);
  //     expect(tv.v(100)).toBe(7);

  //     tv.insertKeyPoint({ t: 15 }); // v:2
  //     tv.addKeyPoint({ t: 16, v: 16 }); // v:2
  //     tv.insertKeyPoint({ t: 45 }); // v:7
  //     tv.addKeyPoint({ t: 50, v: 10 });

  //     expect(tv.v(0)).toBe(1);
  //     checkLinearInterpolation(tv, keyPoints[0], { t: 15, v: 2 });
  //     checkLinearInterpolation(tv, { t: 15, v: 2 }, { t: 16, v: 16 });
  //     checkLinearInterpolation(tv, { t: 16, v: 16 }, keyPoints[1]);
  //     checkLinearInterpolation(tv, keyPoints[1], keyPoints[2]);
  //     checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);
  //     checkLinearInterpolation(tv, keyPoints[3], { t: 45, v: 7 });
  //     checkLinearInterpolation(tv, { t: 45, v: 7 }, { t: 50, v: 10 });
  //     expect(tv.v(100)).toBe(10);
  //   });

  //   test("insertKeyPoint method - fix value at a given time  + set easingBefore", function () {
  //     const keyPoints = [
  //       { t: 10, v: 1 },
  //       { t: 20, v: 3 },
  //       { t: 30, v: 5 },
  //       { t: 40, v: 7 },
  //     ];
  //     const tv = new PVInterpolate(keyPoints);
  //     expect(tv.v(0)).toBe(1);
  //     checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
  //     checkLinearInterpolation(tv, keyPoints[1], keyPoints[2]);
  //     checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);
  //     expect(tv.v(100)).toBe(7);

  //     tv.insertKeyPoint(25, d3ease.easeSinInOut); // v==4
  //     expect(tv.v(0)).toBe(1);
  //     checkLinearInterpolation(tv, keyPoints[0], keyPoints[1]);
  //     checkSinInOutInterpolation(tv, keyPoints[1], { t: 25, v: 4 });
  //     checkLinearInterpolation(tv, { t: 25, v: 4 }, keyPoints[2]);
  //     checkLinearInterpolation(tv, keyPoints[2], keyPoints[3]);
  //     expect(tv.v(100)).toBe(7);
  //   });
});

function checkSinInOutInterpolation(
  tv: PVInterpolate<number>,
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
  tv: PVInterpolate<number>,
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
