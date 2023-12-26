import { P5Runner } from "@src/p5div/P5Runner";
import p5 from "p5";
import { resolveColor } from "../twconf";
import {
  ClockBase,
  EngineActionFunc,
  ITickRunnable,
  TickRunnableEngine,
} from "@src/tickables";
import {
  IPValue,
  PVConstant,
  PVInterpolateColor,
  PVInterpolateNumber,
} from "@src/pvalue";
import { PVSin } from "@src/pvalue/PVSin";
import { randomColorChoice01 } from "./colorChoices";
import { p5TickRunnableEngine } from "@src/p5div/P5TickRunable";
import { PVSegments } from "@src/pvalue/PVSegments";

type TContext = {
  p: p5;
  w: number;
  h: number;
  bgcolor: string;
  items: MovingSquare[];
};

interface IMovingSquareData {
  cx: number;
  cy: number;
  r: number;
  rotate: number;
  color: string;
}

type TPVMovingSquareData = {
  [Properties in keyof IMovingSquareData]?: IPValue<
    IMovingSquareData[Properties]
  >;
};

class MovingSquare implements ITickRunnable<TContext>, IMovingSquareData {
  t = -1;
  cx: number;
  cy: number;
  r: number;
  rotate: number;
  color: string;

  t0: number;

  pv: TPVMovingSquareData = {};

  eol: number | undefined;
  eolAction: undefined | EngineActionFunc<TContext>;

  constructor(t0: number, data: IMovingSquareData) {
    this.t0 = t0;
    this.t = t0;
    this.cx = 0;
    this.cy = data.cy;
    this.r = data.r;
    this.rotate = data.rotate;
    this.color = data.color;

    const dcx = 0.6;
    this.moveTo(dcx, { cx: data.cx });
    this.pv.rotate = new PVSin({
      min: this.rotate - Math.PI / 2,
      max: this.rotate + Math.PI / 2,
      period: 5 + Math.random() * 5,
      keyPoint: { t: this.t0, v: this.rotate },
    });

    this.pv.r = new PVConstant(this.r);
    this.pv.color = new PVConstant(this.color);
  }

  tickRun(
    t: number,
    _dt: number,
    ctx: TContext
  ): string | undefined | EngineActionFunc<TContext> {
    this.t = t;

    for (const [name, pv] of Object.entries(this.pv)) {
      // @ts-ignore
      this[name] = pv.v(t);
    }

    this.draw(ctx.p);

    if (this.eol != undefined && t > this.eol) {
      if (this.eolAction) {
        return this.eolAction;
      } else {
        return "!done";
      }
    }
  }

  draw(p: p5) {
    p.noStroke();
    p.fill(this.color);
    p.beginShape();
    for (let i = 0; i < 4; i += 1) {
      const theta = this.rotate + i * (Math.PI / 2);
      p.vertex(
        this.cx + this.r * Math.sin(theta),
        this.cy + this.r * Math.cos(theta)
      );
    }
    p.endShape(p.CLOSE);
  }

  moveTo(d: number, data: Partial<IMovingSquareData>) {
    const t0 = this.t;
    const t1 = this.t + d;
    if ("cx" in data) {
      const v0 = this.cx;
      const v1 = data.cx!;
      this.pv.cx = new PVSegments([
        {
          b: t1,
          pv: new PVInterpolateNumber([
            { t: t0, v: v0 },
            { t: t1, v: v1 },
          ]),
        },
        {
          pv: new PVSin({
            min: v1 - 30,
            max: v1 + 30,
            keyPoint: { t: t1, v: v1 },
          }),
        },
      ]);
    }
  }

  triggerEOL(t: number, data: IMovingSquareData) {
    this.pv.color = new PVInterpolateColor(
      [
        { t: this.t, v: this.color },
        { t: t, v: data.color },
      ],
      { afterMode: "constant" }
    );
    this.pv.r = new PVInterpolateNumber(
      [
        { t: this.t, v: this.r },
        { t: t, v: data.r },
      ],
      { afterMode: "constant" }
    );

    this.eol = t;
  }
}

export function tickRunableSampleA(w: number, h: number): P5Runner {
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
    currentSquare: MovingSquare
  ): MovingSquare {
    const d = 2;
    const newData: IMovingSquareData = generateSquareData(currentSquare);
    currentSquare.triggerEOL(t + d, newData);

    currentSquare.eolAction = (e, _child) => {
      const newSquare = new MovingSquare(t + d, currentSquare);
      e.replaceChild(currentSquare, newSquare);
      e.scheduleAction(
        t + d + Math.random() * 3 + 3,
        (e1, child) => {
          replaceSquare(e1.t, e1.ctx, e1, child as MovingSquare);
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
    const square = new MovingSquare(t, {
      cx,
      cy: h / 2,
      r: h / 3,
      rotate: 0,
      color: randomColorChoice01(),
    });

    engine.scheduleAction(t, (e) => {
      square.eolAction = (e, child) => {
        e.replaceChild(
          child!,
          replaceSquare(e.t, e.ctx, engine, child as MovingSquare)
        );
      };
      e.appendChild(square);
    });

    const eol = t + 3 + Math.random() * 2;

    engine.scheduleAction(eol, (e) => {
      replaceSquare(eol, e.ctx, e, square);
    });
  }

  function engineBuilder(p: p5) {
    const ctx0: TContext = {
      p,
      w,
      h,
      bgcolor: resolveColor("slate-500"),
      items: [],
    };

    const engine = new TickRunnableEngine(ctx0, [], {
      clock: new ClockBase({ scale: 1 / 1000 }),
    });

    engine.appendChild({
      tickRun: (_t, _dt, ctx) => {
        ctx.p.background(ctx.bgcolor);
        return "";
      },
    });

    scheduleInitialSquare(engine, 3, w / 4);
    scheduleInitialSquare(engine, 4, w / 2);
    scheduleInitialSquare(engine, 5, (w * 3) / 4);

    return engine;
  }

  return p5TickRunnableEngine(engineBuilder, {
    size: { w, h },
    frameRate: 32,
  });
}
