import { p5CTickEngineRunner } from "@src/p5div/P5CTickEngineRunner";
import { P5Runner } from "@src/p5div/P5Runner";
import { CTickEngine } from "@src/tickables/CTickEngine";
import p5 from "p5";
import { resolveColor } from "../twconf";
import { CTickableFunc, ClockBase } from "@src/tickables";

type TContext = {
  p: p5;
  bgcolor: string;
  lineColor: string;
  xa: number;
  ya: number;
  xb: number;
  yb: number;
};

export function tickRunnableSampleC(
  w: number,
  h: number
): [P5Runner, CTickEngine<TContext>] {
  const ctx0: Omit<TContext, "p"> = {
    bgcolor: resolveColor("orange-800"),
    lineColor: resolveColor("rose-600"),
    xa: w / 4,
    ya: h / 2,
    xb: (w * 3) / 4,
    yb: h / 2,
  };

  const drawBg: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    ctx.p.background(ctx.bgcolor);
    return "";
  };

  const movePoints: CTickableFunc<TContext, string> = (t, _dt, ctx) => {
    ctx.xa = ctx0.xa + Math.sin(2 * Math.PI * 0.4 * t) * h;
    ctx.ya = ctx0.ya + (Math.sin(2 * Math.PI * 0.1 * t) * h) / 3;
    ctx.xb = ctx0.xb + Math.sin(2 * Math.PI * 0.33 * t) * h;
    ctx.yb = ctx0.yb - (Math.sin(2 * Math.PI * 0.21 * t) * h) / 3;
    return "";
  };

  const drawLine: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    const p = ctx.p;
    p.noFill();
    p.stroke(ctx.lineColor);
    p.strokeWeight(3);
    p.line(ctx.xa, ctx.ya, ctx.xb, ctx.yb);
    return "";
  };

  const clock = new ClockBase({ scale: 1 / 1000 });

  const engine = new CTickEngine(
    [[drawBg, "bg"], [movePoints, "animate"], drawLine],
    {
      layers: ["bg", "animate", "draw"],
      defaultLayer: "draw",
      clock: clock,
    }
  );

  const runner = p5CTickEngineRunner<TContext>(engine, ctx0, {
    size: { w, h },
    mouseClicked() {
      clock.paused = !clock.paused;
    },
  });

  return [runner, engine];
}
