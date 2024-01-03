import { P5Runner } from "@src/p5div/P5Runner";
import p5 from "p5";
import { resolveColor } from "../twconf";
import { ClockBase, TickRunnableEngine } from "@src/tickables";
import { randomColorChoice01 } from "./colorChoices";
import { p5TickRunnableEngineRunner } from "@src/p5div/P5TickRunable";
import { IMovingSquareData, MovingSquare } from "./MovingSquare";

type TContext = {
  p: p5;
  w: number;
  h: number;
  bgcolor: string;
  items: MovingSquare<TContext>[];
};

export function tickRunableSampleA(
  w: number,
  h: number
): [P5Runner, TickRunnableEngine<TContext>] {
  function generateSquareData(data0: IMovingSquareData): IMovingSquareData {
    let deltar =
      Math.sign(Math.random() - 0.5) * (data0.r * (0.1 + Math.random() / 2));

    if (data0.r + deltar > h * 0.48) {
      deltar = -Math.abs(deltar);
    } else if (data0.r + deltar < h * 0.1) {
      deltar = Math.abs(deltar);
    }

    const data: IMovingSquareData = {
      cx: data0.cx,
      cy: data0.cy,
      r: data0.r + deltar,
      rotate: 0,
      color: randomColorChoice01(),
    };
    return data;
  }

  function replaceSquare(
    t: number,
    ctx: TContext,
    e: TickRunnableEngine<TContext>,
    currentSquare: MovingSquare<TContext>
  ): MovingSquare<TContext> {
    const d = 2;
    const newData: IMovingSquareData = generateSquareData(currentSquare);
    currentSquare.triggerEOL(t + d, newData);

    currentSquare.eolAction = (e, _child) => {
      const newSquare = new MovingSquare<TContext>(t + d, currentSquare);
      e.replaceChild(currentSquare, newSquare);
      e.scheduleAction(
        t + d + Math.random() * 3 + 3,
        (e1, child) => {
          replaceSquare(e1.t, e1.ctx!, e1, child as MovingSquare<TContext>);
        },
        newSquare
      );
    };

    return currentSquare;
  }

  function scheduleInitialSquare(
    engine: TickRunnableEngine<TContext>,
    t: number,
    cx: number
  ) {
    const square = new MovingSquare<TContext>(t, {
      cx: 0,
      cy: h / 2,
      r: h / 3,
      rotate: 0,
      color: randomColorChoice01(),
    });

    engine.scheduleAction(t, (e) => {
      square.eolAction = (e, child) => {
        e.replaceChild(
          child!,
          replaceSquare(e.t, e.ctx!, engine, child as MovingSquare<TContext>)
        );
      };
      e.appendChild(square);
      square.moveTo(0.6, { cx });
    });

    const eol = t + 3 + Math.random() * 2;

    engine.scheduleAction(eol, (e) => {
      replaceSquare(eol, e.ctx!, e, square);
    });
  }

    const ctx0: Omit<TContext, "p"> = {
      w,
      h,
      bgcolor: resolveColor("slate-500"),
      items: [],
    };

    const engine = new TickRunnableEngine<TContext>([], {
      clock: new ClockBase({ scale: 1 / 1000 }),
    });


    engine.appendChild({
      tickRun: (_t, _dt, ctx) => {
        ctx!.p.background(ctx!.bgcolor);
        return "";
      },
    });

    scheduleInitialSquare(engine, 3, w / 4);
    scheduleInitialSquare(engine, 4, w / 2);
    scheduleInitialSquare(engine, 5, (w * 3) / 4);


  const runner= p5TickRunnableEngineRunner(engine, ctx0,{
    size: { w, h },
    frameRate: 32,
  });

  console.log("SAMPLE A:", runner, engine)

  return [runner, engine];
}
