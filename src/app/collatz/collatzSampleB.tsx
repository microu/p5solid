import { p5CTickEngineRunner } from "@src/p5div/P5CTickEngineRunner";
import { P5Runner } from "@src/p5div/P5Runner";
import { CTickableFunc, ClockBase } from "@src/tickables";
import { CTickEngine } from "@src/tickables/CTickEngine";
import p5 from "p5";
import { collatzSequence } from ".";
import { resolveColor } from "../twconf";

import { Random } from "random-js";
import { P5LineDrawer } from "./P5LineDrawer";
import { PointSequence } from "@src/geom2d";

type TContext = {
  p: p5;
  seqIdList: number[];
  lineDrawers: (P5LineDrawer | undefined)[];
  bgcolor: string;
};

export function collatzSampleB(
  w: number,
  h: number
): [P5Runner, CTickEngine<TContext>] {
  const rnd = new Random();
  const clock = new ClockBase({ scale: 1 / 1000 });

  const drawBg: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    ctx.p.background(ctx.bgcolor);
    return "";
  };

  let nextChange = 3;
  const changeSequences: CTickableFunc<TContext, string> = (t, _dt, ctx) => {
    if (t > nextChange) {
      const ichange = rnd.integer(0, ctx.seqIdList.length - 1);
      ctx.seqIdList[ichange] = rnd.integer(13, 20000);
      ctx.lineDrawers[ichange] = undefined;
      nextChange += rnd.real(1.5, 4);
    }
    return "";
  };

  const updateDrawers: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    for (let i = 0; i < ctx.seqIdList.length; i += 1) {
      if (ctx.lineDrawers[i] == undefined) {
        const seq0 = collatzSequence(ctx.seqIdList[i]);
        const seq = [...seq0];
        seq.reverse();
        seq.push(...seq0);

        ctx.lineDrawers[i] = new P5LineDrawer(
          new PointSequence(seq.map((v, i) => ({ x: i, y: v }))),
          {
            box: {
              a: { x: 0, y: (h * (i + 1)) / 4 },
              b: { x: w, y: (h * (i + 1)) / 4 - 80 },
            },
          },
          { color: resolveColor("pink-600"), weight: 2.5 }
        );
      }
    }
    return "";
  };

  const drawLines: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    for (const ld of ctx.lineDrawers) {
      ld?.draw(ctx.p);
    }
    return "";
  };

  const engine = new CTickEngine(
    [
      ["bg", drawBg],
      ["change", changeSequences],
      ["prepare", updateDrawers],
      ["draw", drawLines],
    ],
    {
      layers: ["bg", "change", "prepare", "draw"],
      defaultLayer: "prepare",
      clock: clock,
    }
  );

  const ctx0: Omit<TContext, "p"> = {
    seqIdList: [27, rnd.integer(13, 20000), rnd.integer(13, 20000)],
    lineDrawers: [undefined, undefined, undefined],
    bgcolor: resolveColor("stone-800"),
  };

  const runner = p5CTickEngineRunner<TContext>(engine, ctx0, {
    size: { w, h },
  });
  return [runner, engine];
}
