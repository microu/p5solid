import { p5CTickEngineRunner } from "@src/p5div/P5CTickEngineRunner";
import { P5Runner } from "@src/p5div/P5Runner";
import { CTickableFunc, ClockBase } from "@src/tickables";
import { CTickEngine } from "@src/tickables/CTickEngine";
import p5 from "p5";
import { collatzSequence } from ".";
import { resolveColor } from "../twconf";
import { P5LinesDrawer } from "./P5LinesDrawer";

type TContext = {
  p: p5;
  n: number;
  seq: number[];
  lineDrawer?:P5LinesDrawer;
  seqPoints?: { x: number; y: number }[];
  bgcolor: string;
};

export function collatzSampleA(
  w: number,
  h: number
): [P5Runner, CTickEngine<TContext>] {
  const clock = new ClockBase({ scale: 1 / 1000 });

  const drawBg: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    ctx.p.background(ctx.bgcolor);
    return "";
  };

  let nextChangeSeq = 3;
  const changeSeq: CTickableFunc<TContext, string> = (t, _dt, ctx) => {
    if (t >= nextChangeSeq) {
      ctx.n += 1;
      ctx.seq = collatzSequence(ctx.n);
      ctx.seqPoints = undefined;
      nextChangeSeq += 1 + ctx.seq.length / 20;
    }
    return "";
  };

  const updatePoints: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    if (ctx.seqPoints == undefined) {
      ctx.seqPoints = [];
      const n = ctx.seq.length;
      let ymin = Math.min(...ctx.seq);
      let ymax = Math.max(...ctx.seq);
      ymin -= 0.1 * (ymax - ymin);
      ymax += 0.1 * (ymax - ymin);
      const xstep = w / (n - 1);
      for (let i = 0; i < n; i += 1) {
        const yy = (ctx.seq[i] - ymin) / (ymax - ymin);
        ctx.seqPoints.push({ x: i * xstep, y: h * (1 - yy) });
      }
    }
    return "";
  };

  const drawSeqLine: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    const p = ctx.p;
    p.noFill();
    p.stroke(resolveColor("red-700"));
    p.strokeWeight(3);
    p.beginShape();
    for (const point of ctx.seqPoints ?? []) {
      p.vertex(point.x, point.y);
    }
    p.endShape();
    return "";
  };

  const engine = new CTickEngine(
    [
      ["bg", drawBg],
      ["points", changeSeq],
      ["points", updatePoints],
      ["draw", drawSeqLine],
    ],
    {
      layers: ["bg", "points", "draw"],
      defaultLayer: "draw",
      clock: clock,
    }
  );

  const ctx0 = {
    n: 27,
    seq: collatzSequence(27),
    bgcolor: resolveColor("stone-400"),
  };

  const runner = p5CTickEngineRunner<TContext>(engine, ctx0, {
    size: { w, h },
  });
  return [runner, engine];
}
