import p5 from "p5";
import { resolveColor } from "../twconf";
import { buildP5ContextRunner } from "@src/p5div/P5ContextRunner";

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
    ctx.cx =
      w / 2 +
      (Math.sin((ctx.t * (1 + Math.sin(ctx.t / 1500) * 0.15)) / 3000) * w) / 2;
    return ctx;
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
