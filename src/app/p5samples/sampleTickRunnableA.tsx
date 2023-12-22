import { P5Runner } from "@src/p5div/P5Runner";
import { buildP5TickRunnable } from "@src/p5div/P5TickRunable";
import { ClockContext } from "@src/p5div/P5TickRunable";
import p5 from "p5";
import { resolveColor } from "../twconf";
import { ClockBase, ITickRunnable } from "@src/tickables";
import { IPValue } from "@src/pvalue";
import { PVSin } from "@src/pvalue/PVSin";
import { colorChoices01 } from "./colorChoices";

type TContext = {
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
  const ctx0: TContext = {
    w,
    h,
    bgcolor: resolveColor("slate-400"),
    items: [],
  };

  function setup(p: p5, ctx: TContext) {
    p.createCanvas(ctx.w, ctx.h);
    p.frameRate(32);
  }

  function draw(p: p5, ctx: ClockContext<TContext>) {
    p.background(ctx.bgcolor);
    console.log("DRAW ITEMS:", ctx.items.length)
    for (const item of ctx.items) {
      item.draw(p);
    }
  }

  function tickRun(t: number, dt: number, ctx: TContext) {
    if (ctx.items.length == 0) {
      ctx.items.push(
        new MovingSquare(t, {
          cx: ctx.w / 2,
          cy: ctx.h / 2,
          r: ctx.h * 0.2,
          rotate: 0,
          color: resolveColor("orange-500"),
        })
      );
      ctx.items.push(
        new MovingSquare(t, {
          cx: ctx.w / 4,
          cy: ctx.h / 2,
          r: ctx.h * 0.3,
          rotate: 0,
          color: resolveColor("emerald-500"),
        })
      );

      ctx.items.push(
        new MovingSquare(t, {
          cx: (ctx.w * 3) / 4,
          cy: ctx.h / 2,
          r: ctx.h * 0.1,
          rotate: 0,
          color: resolveColor("rose-700"),
        })
      );
    }

    for (let i = 0; i < ctx.items.length; i += 1) {
      const item = ctx.items[i];
      const r = item.tickRun(t, dt, ctx);
      if (r == "!done") {
        ctx.items[i] = replaceItem(t, ctx, item);
      }
    }
    return "";
  }

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

  const clock = new ClockBase({ scale: 1 / 1000 });

  return buildP5TickRunnable<TContext>({
    ctx0,
    clock,
    setup,
    draw,
    run: { tickRun },
  });
}
