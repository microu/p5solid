import p5 from "p5";
import { resolveColor } from "../twconf";
import { buildP5ContextRunner } from "@src/p5div/P5ContextRunner";
import { IKeyPoint, IPValue, PVConstant, PVInterpolate } from "@src/pvalue";
import { easeBackOut } from "d3-ease";
import { PVSin } from "@src/pvalue/PVSin";
import { colorChoices01 } from "./colorChoices";

type TMovingCircle = {
  cx: number;
  cy: number;
  d: number;
  color: string;
};

type TMovingCirclesContext = {
  w: number;
  h: number;
  bgcolor: string;
  circles: TMovingCircle[];
};

export function movingCircles() {
  const w = 600;
  const h = 90;
  const d0 = h / 2;

  const ctx0: TMovingCirclesContext = {
    w,
    h,
    bgcolor: resolveColor("zinc-500"),
    circles: [
      {
        cx: w / 2,
        cy: h / 2,
        d: d0,
        color: resolveColor("orange-600"),
      },
    ],
  };

  let pcx: IPValue<number> = new PVConstant(w / 2);
  let pd: IPValue<number> = new PVConstant(d0);

  let nextUpdaterUpdate = 1666;

  function setup(p: p5, ctx: TMovingCirclesContext) {
    console.log("SETUP", ctx);
    p.createCanvas(w, h);
    p.frameRate(32);
  }

  function draw(
    p: p5,
    ctx: TMovingCirclesContext & { t: number; dt: number }
  ): string {
    p.background(ctx.bgcolor);
    for (const circle of ctx.circles) {
      p.noStroke();
      p.fill(circle.color);
      p.circle(circle.cx, circle.cy, circle.d);
  
    }

    return "";
  }

  function updater(ctx: TMovingCirclesContext & { t: number; dt: number }) {
    if (ctx.t > nextUpdaterUpdate) {
      const duration = updateUpdater(ctx);
      nextUpdaterUpdate += duration;
    }
    ctx.circles[0].cx = pcx.v(ctx.t);
    ctx.circles[0].d = pd.v(ctx.t);
    return ctx;
  }

  function updateUpdater(
    ctx: TMovingCirclesContext & { t: number; dt: number }
  ): number {
    ctx.circles[0].color =
      colorChoices01[Math.floor(Math.random() * colorChoices01.length)];

    if (Math.random() < 0.3) {
      // sin
      const amplitude = 20 + Math.random() * 50;
      const period = 700 + Math.random() * 300;
      pcx = new PVSin({
        min: ctx.circles[0].cx - amplitude,
        max: ctx.circles[0].cx + amplitude,
        period,
        keyPoint: { t: ctx.t, v: ctx.circles[0].cx },
      });

      pd = new PVSin({
        min: ctx.circles[0].d * 0.97,
        max: ctx.circles[0].d * 1.03,
        period: period * 1.1,
        keyPoint: { t: ctx.t, v: ctx.circles[0].d },
      });
      console.log("updateUpdater Sin");

      return 2000 + Math.random() * 4000;
    }

    if (Math.random() < 0.3) {
      // constant
      pcx = new PVConstant(ctx.circles[0].cx);

      const period = 400 + Math.random() * 400;
      pd = new PVSin({
        min: d0 * 0.9,
        max: d0 * 1.1,
        period: period,
        keyPoint: { t: ctx.t, v: ctx.circles[0].d },
      });
      console.log("updateUpdater Constant");
      return 500 + Math.random() * 1500;
    }

    const keyPoints: IKeyPoint<number>[] = [{ t: ctx.t, v: ctx.circles[0].cx }];
    let cx = ctx.circles[0].cx;
    let t = ctx.t;
    for (let i = 0; i < 3; i++) {
      let delta = 200 + Math.random() * 200;

      if (Math.abs(cx - delta - w / 2) < Math.abs(cx + delta - w / 2)) {
        cx = cx - delta;
      } else {
        cx = cx + delta;
      }
      t += 2000 + Math.random() * 1200;
      keyPoints.push({ t: t, v: cx });
    }
    console.log("KP:", keyPoints);
    pcx = new PVInterpolate(keyPoints, { easing: easeBackOut });
    pd = new PVInterpolate(
      [
        { t: ctx.t, v: ctx.circles[0].d },
        { t: ctx.t + 100, v: d0 },
      ],
      { afterMode: "constant" }
    );

    console.log("updateUpdater KeyPoints");
    return t - ctx.t;
  }

  const runner = buildP5ContextRunner<TMovingCirclesContext>(
    ctx0,
    {
      setup,
      draw,
    },
    updater
  );

  return runner;
}
