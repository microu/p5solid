import { P5Runner } from "@src/p5div/P5Runner";
import { p5TickRunnableEngineRunner } from "@src/p5div/P5TickRunable";
import { ClockBase, TickRunnableEngine } from "@src/tickables";
import p5 from "p5";
import { randomColorChoice01 } from "./colorChoices";
import { resolveColor } from "../twconf";

type TContext = {
  p: p5;
  bgcolor: string;
  colora: string;
  colorb: string;
};

export function tickRunableSampleB(): [P5Runner, TickRunnableEngine<TContext>] {
  let nextUpdate = 0;

  function update(t: number, _dt: number, ctx: TContext) {
    if (t >= nextUpdate) {
      if (Math.random() < 0.5) {
        ctx.colora = randomColorChoice01();
      } else {
        ctx.colorb = randomColorChoice01();
      }

      nextUpdate = t + 1.5 + Math.random() * 3;
    }

    return "";
  }

  function draw(_t: number, _dt: number, ctx: TContext) {
    const p = ctx.p!;

    p.background(ctx.bgcolor);
    p.noStroke();
    p.fill(ctx.colora);
    p.circle(p.width / 3, p.height / 2, p.height * 0.75);
    p.fill(ctx.colorb);
    p.circle((p.width * 2) / 3, p.height / 2, p.height * 0.75);
    return "";
  }

  const ctx: Omit<TContext, "p"> = {
    bgcolor: resolveColor("slate-300"),
    colora: randomColorChoice01(),
    colorb: randomColorChoice01(),
  };

  const engine = new TickRunnableEngine<TContext>([draw, update], {
    clock: new ClockBase({ scale: 1 / 1000 }),
    init: (t: number, dt: number, ctx: any) => {
      nextUpdate = t + 1.5 + Math.random() * 3;
      return "";
    },
  });

  const runner = p5TickRunnableEngineRunner(engine, ctx, {
    size: { w: 700, h: 64 },
    frameRate: 32,
  });

  return [runner, engine];
}
