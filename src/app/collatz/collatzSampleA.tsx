import { p5CTickEngineRunner } from "@src/p5div/P5CTickEngineRunner";
import { P5Runner } from "@src/p5div/P5Runner";
import { CTickableFunc, ClockBase } from "@src/tickables";
import { CTickEngine } from "@src/tickables/CTickEngine";
import p5 from "p5";
import { collatzSequence } from ".";
import { resolveColor } from "../twconf";
import {
  P5LinesDrawer,
  TLineData,
  TP5LinesDrawerOptions,
} from "./P5LinesDrawer";

import { Random } from "random-js";



type TContext = {
  p: p5;
  n: number;
  seqList: number[][];
  lineDrawer?: P5LinesDrawer;
  bgcolor: string;
};

export function collatzSampleA(
  w: number,
  h: number,
  lineDrawerOptions: Partial<TP5LinesDrawerOptions> = {}
): [P5Runner, CTickEngine<TContext>] {
  const clock = new ClockBase({ scale: 1 / 1000 });

  lineDrawerOptions = { margin: 5, globalScale: false, ...lineDrawerOptions };

  const drawBg: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    ctx.p.background(ctx.bgcolor);
    return "";
  };

  function randomCollatzSequenceList():number[][] {

    const r = [[]] as number[][]

    while (r.length < 5) {
      let seq = [] as number[]
      while (seq.length < 12) {
        seq = collatzSequence(rnd.integer(13, 10000))
      }
      r.push(seq)
    }

    return r;
  }

  const rnd = new Random()

  let nextChangeSeq = 3;
  const changeSeq: CTickableFunc<TContext, string> = (t, _dt, ctx) => {
    if (t >= nextChangeSeq) {
      ctx.n += 1;
      ctx.seqList = randomCollatzSequenceList()

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

    ctx.lineDrawer = new P5LinesDrawer(w, h, lines, lineDrawerOptions);
    return "";
  };

  const drawSeqLine: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
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
    seqList: randomCollatzSequenceList(),
    bgcolor: resolveColor("stone-100"),
  };

  const runner = p5CTickEngineRunner<TContext>(engine, ctx0, {
    size: { w, h },
  });
  return [runner, engine];
}
