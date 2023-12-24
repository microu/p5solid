import { P5Runner } from "@src/p5div/P5Runner";
import p5 from "p5";
import { resolveColor } from "../twconf";
import { ClockBase, ITickRunnable, TickRunnableEngine } from "@src/tickables";
import { IPValue } from "@src/pvalue";
import { PVSin } from "@src/pvalue/PVSin";
import { colorChoices01 } from "./colorChoices";

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

  constructor(t0: number, data: IMovingSquareData) {
    this.t0 = t0;
    this.cx = data.cx;
    this.cy = data.cy;
    this.r = data.r;
    this.rotate = data.rotate;
    this.color = data.color;
    this.eol = t0 + 8 + Math.random() * 8;

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

  tickRun(t: number, dt: number, ctx: TContext): string {
    this.cx = this.pcx.v(t);
    this.rotate = this.protate.v(t);

    this.draw(ctx.p);
    
    return t < this.eol ? "" : "!done";
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
  let engine: TickRunnableEngine<TContext>;

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
      color: colorChoices01[Math.floor(Math.random() * colorChoices01.length)],
    };

    item = new MovingSquare(t, data);
    return item;
  }

  function setup(p: p5) {
    p.createCanvas(w, h);
    p.frameRate(32);
    const ctx0: TContext = {
      p,
      w,
      h,
      bgcolor: resolveColor("slate-500"),
      items: [],
    };
    engine = new TickRunnableEngine(ctx0, [], {
      clock: new ClockBase({ scale: 1 / 1000 }),
      handleDone: (_e, t, ctx, child) => {
        const newItem = replaceItem(t, ctx, child as MovingSquare);
        console.log("handleDone",t, child, newItem);
        return newItem;
      },
    });

    engine.appendChild({
      tickRun: (_t, _dt, ctx) => {
        ctx.p.background(ctx.bgcolor);
        return "";
      },
    });
    engine.appendChild(
      new MovingSquare(0, {
        cx: w / 2,
        cy: h / 2,
        r: h / 3,
        rotate: 0,
        color: "darkred",
      })
    );
  }

  function draw(p: p5) {
    engine.timeTick(p.millis());
  }

  return new P5Runner(setup, draw);
}
