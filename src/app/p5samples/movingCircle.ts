import p5 from "p5";
import { resolveColor } from "../twconf";
import { buildP5ContextRunner } from "@src/p5div/P5ContextRunner";
import { IKeyPoint, IPValue, PVConstant, PVInterpolate } from "@src/pvalue";
import { easeBackOut, easeBounceOut, easeSinInOut } from "d3-ease";
import { PVSin } from "@src/pvalue/PVSin";

type TMovingCircleContext = {
  cx: number;
  cy: number;
  d: number;
  bgcolor: string;
  color: string;
};

export function movingCircle() {
  const w = 600;
  const h = 90;
  const ctx0: TMovingCircleContext = {
    cx: w / 2,
    cy: h / 2,
    d: h / 2,
    bgcolor: resolveColor("zinc-500"),
    color: resolveColor("orange-600"),
  };

  let pcx: IPValue<number> = new PVConstant(w / 2);
  let nextUpdaterUpdate = 1666;

  function setup(p: p5, ctx: TMovingCircleContext) {
    console.log("SETUP", ctx);
    p.createCanvas(w, h);
    p.frameRate(32);
  }

  function draw(
    p: p5,
    ctx: TMovingCircleContext & { t: number; dt: number }
  ): string {
    p.background(ctx.bgcolor);
    p.noStroke();
    p.fill(ctx.color);
    p.circle(ctx.cx, ctx.cy, ctx.d);

    return "";
  }

  function updater(ctx: TMovingCircleContext & { t: number; dt: number }) {
    if (ctx.t > nextUpdaterUpdate) {
      updateUpdater(ctx);
      nextUpdaterUpdate += 1500 + Math.random() * 1500;
    }
    ctx.cx = pcx.v(ctx.t);
    return ctx;
  }

  let updateIndex = 0;

  function updateUpdater(
    ctx: TMovingCircleContext & { t: number; dt: number }
  ) {
    if (Math.random() < 0.2) {
      // constant
      pcx = new PVInterpolate([
        { t: ctx.t, v: ctx.cx },
        { t: ctx.t + 100, v: w / 2 },
      ], {easing:easeSinInOut, afterMode: "constant"});
      return;
    }

    if (Math.random() < 0.2) {
      // sin
      pcx = new PVSin({min: 250, max: 350, period:1500})
      return;
    }


    const keyPoints: IKeyPoint<number>[] = [{ t: ctx.t, v: ctx.cx }];
    let cx = ctx.cx;
    let t = ctx.t;
    for (let i = 0; i < 9; i++) {
      let delta = -100 + Math.random() * 200;
      if (updateIndex % 2 == 1) {
        delta *= 2;
      }

      if (cx + delta < 10 || cx + delta > w - 10) {
        cx = cx - delta;
      } else {
        cx = cx + delta;
      }
      t += 150 + Math.random() * 200;
      keyPoints.push({ t: t, v: cx });
    }
    updateIndex += 1;
    pcx = new PVInterpolate(keyPoints, { easing: easeSinInOut });
  }

  const runner = buildP5ContextRunner<TMovingCircleContext>(
    ctx0,
    {
      setup,
      draw,
    },
    updater
  );

  return runner;
}
