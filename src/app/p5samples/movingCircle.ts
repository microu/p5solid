import p5 from "p5";
import { resolveColor } from "../twconf";
import { buildP5ContextRunner } from "@src/p5div/P5ContextRunner";
import { IKeyPoint, IPValue, PVConstant, PVInterpolate } from "@src/pvalue";
import { easeBackOut, easeBounceOut, easeElasticOut, easeSinInOut } from "d3-ease";
import { PVSin } from "@src/pvalue/PVSin";
import { colorChoices01 } from "./colorChoices";

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
      const duration = updateUpdater(ctx);
      nextUpdaterUpdate += duration;
    }
    ctx.cx = pcx.v(ctx.t);
    return ctx;
  }

  
  function updateUpdater(
    ctx: TMovingCircleContext & { t: number; dt: number }
  ): number {
    console.log("updateUpdater")
    ctx.color =
      colorChoices01[Math.floor(Math.random() * colorChoices01.length)];

    if (Math.random() < 0.2) {
      // sin
      const amplitude = 20 + Math.random() * 50;
      const period = 700 + Math.random() * 300;
      pcx = new PVSin({
        min: ctx.cx - amplitude,
        max: ctx.cx + amplitude,
        period,
        keyPoint: { t: ctx.t, v: ctx.cx },
      });
      return 2000 + Math.random() * 4000;
    }

    if (Math.random() < 0.2) {
      // constant
      pcx = new PVConstant(ctx.cx);
      return 500 + Math.random() * 1500;
    }

    const keyPoints: IKeyPoint<number>[] = [{ t: ctx.t, v: ctx.cx }];
    let cx = ctx.cx;
    let t = ctx.t;
    for (let i = 0; i < 5; i++) {
      let delta = 200 + Math.random() * 200;

      if (Math.abs(cx - delta - w/2)  < Math.abs(cx + delta - w/2)) {
        cx = cx - delta;
      } else {
        cx = cx + delta;
      }
      t += 2000 + Math.random() * 1200;
      keyPoints.push({ t: t, v: cx });
    }
    console.log("KP:", keyPoints)
    pcx = new PVInterpolate(keyPoints, { easing:easeBackOut });
    return t - ctx.t;
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
