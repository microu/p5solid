import { p5CTickEngineRunner } from "@src/p5div/P5CTickEngineRunner";
import { P5Runner } from "@src/p5div/P5Runner";
import { CTickableFunc, ClockBase } from "@src/tickables";
import { CTickEngine } from "@src/tickables/CTickEngine";
import p5 from "p5";
import { collatzSequence } from ".";
import { resolveColor } from "../twconf";
import { P5LinesDrawer, TLineData } from "./P5LinesDrawer";

type TContext = {
  p: p5;
  n: number;
  seqList: number[][];
  lineDrawer?: P5LinesDrawer;
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
      ctx.seqList = [
        collatzSequence(ctx.n),
        collatzSequence(ctx.n * 29),
        collatzSequence(ctx.n * 79),
      ];

      ctx.lineDrawer = undefined;
      nextChangeSeq += 1 + ctx.seqList[0].length / 20;
    }
    return "";
  };

  const updatePoints: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    if (ctx.lineDrawer != undefined) {
      return "";
    }

    const lines: TLineData[] = [];
    const colors = [
      resolveColor("red-700"),
      resolveColor("emerald-700"),
      resolveColor("purple-700"),
    ];
    let i = 0;
    for (const seq of ctx.seqList) {
      lines.push({
        points: seq.map((v, i) => ({ x: i, y: v })),
        color: colors[i % colors.length],
        weight: 2,
      });
      i += 1;
    }

    ctx.lineDrawer = new P5LinesDrawer(w, h, lines, { globalScale: false });
    return "";
  };

  const drawSeqLine: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    // const p = ctx.p;
    // p.noFill();
    // p.stroke(resolveColor("red-700"));
    // p.strokeWeight(3);
    // p.beginShape();
    // for (const point of ctx.seqPoints ?? []) {
    //   p.vertex(point.x, point.y);
    // }
    // p.endShape();
    ctx.lineDrawer?.draw(ctx.p);
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
    seqList: [collatzSequence(27)],
    bgcolor: resolveColor("stone-400"),
  };

  const runner = p5CTickEngineRunner<TContext>(engine, ctx0, {
    size: { w, h },
  });
  return [runner, engine];
}
