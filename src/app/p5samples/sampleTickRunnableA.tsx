import { P5Runner } from "@src/p5div/P5Runner";
import p5 from "p5";
import { resolveColor } from "../twconf";
import {
  ClockBase,
  EngineActionFunc,
  ITickRunnable,
  TickRunnableEngine,
} from "@src/tickables";
import { IPValue } from "@src/pvalue";
import { PVSin } from "@src/pvalue/PVSin";
import { randomColorChoice01 } from "./colorChoices";
import { p5TickRunnableEngine } from "@src/p5div/P5TickRunable";

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

class MovingSquare implements ITickRunnable<TContext>, IMovingSquareData {
  cx: number;
  cy: number;
  r: number;
  rotate: number;
  color: string;
  t0: number;

  pcx: IPValue<number>;
  protate: IPValue<number>;

  eol: number;
  eolAction: undefined | EngineActionFunc<TContext>;

  constructor(t0: number, data: IMovingSquareData) {
    this.t0 = t0;
    this.cx = data.cx;
    this.cy = data.cy;
    this.r = data.r;
    this.rotate = data.rotate;
    this.color = data.color;
    this.eol = t0 + 4 + Math.random() * 4;

    this.pcx = new PVSin({
      min: this.cx - 50,
      max: this.cx + 50,
      period: 1.5 + Math.random() * 1.5,
      keyPoint: { t: this.t0, v: this.cx },
    });

    this.protate = new PVSin({
      min: this.rotate - Math.PI / 2,
      max: this.rotate + Math.PI / 2,
      period: 5 + Math.random() * 5,
      keyPoint: { t: this.t0, v: this.rotate },
    });
  }

  tickRun(
    t: number,
    _dt: number,
    ctx: TContext
  ): string | undefined | EngineActionFunc<TContext> {
    this.cx = this.pcx.v(t);
    this.rotate = this.protate.v(t);

    this.draw(ctx.p);

    if (t >= this.eol) {
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
}

export function tickRunableSampleA(w: number, h: number): P5Runner {
  function replaceItem(
    t: number,
    ctx: TContext,
    item: MovingSquare
  ): MovingSquare {
    const data: IMovingSquareData = {
      cx: item.cx,
      cy: item.cy,
      r: ctx.h * (0.2 + Math.random() * 0.25),
      rotate: item.rotate,
      color: randomColorChoice01(),
    };

    item = new MovingSquare(t, data);
    item.eolAction = (e, child) => {
      e.replaceChild(child!, replaceItem(e.t, e.ctx, child as MovingSquare));
    };

    return item;
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

    const square = new MovingSquare(0, {
      cx: w / 2,
      cy: h / 2,
      r: h / 3,
      rotate: 0,
      color: "darkred",
    });

    square.eolAction = (e, child) => {
      e.replaceChild(child!, replaceItem(e.t, e.ctx, child as MovingSquare));
    };

    engine.appendChild(square);

    return engine;
  }

  return p5TickRunnableEngine(engineBuilder, {
    size: { w, h },
    frameRate: 32,
  });
}
