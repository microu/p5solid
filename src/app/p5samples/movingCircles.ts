import p5 from "p5";
import { resolveColor } from "../twconf";
import { buildP5ContextRunner } from "@src/p5div/P5ContextRunner";
import { IKeyPoint, IPValue, PVConstant, PVInterpolate } from "@src/pvalue";
import { easeBackOut, easeSinInOut } from "d3-ease";
import { PVSin } from "@src/pvalue/PVSin";
import { colorChoices01 } from "./colorChoices";
import { ContextUpdaterFunc } from "@src/segments/context";
import { ITickable } from "@src/segments/tickables";

interface IMovingCircleData {
  cx: number;
  cy: number;
  d: number;
  color: string;
}

class MovingCircle implements IMovingCircleData {
  // "global" data
  h: number;
  w: number;

  // drawing data
  cx: number;
  cy: number;
  vcy = 0;
  acy = 0;

  d: number;
  color: string;

  prevt = -1;
  dt = 0;

  // update data
  pcx!: IPValue<number>;
  pcd!: IPValue<number>;
  pcybump: IPValue<number> = new PVConstant(0);
  nextcybump = 1;
  pcolor!: IPValue<string>;
  nextUpdatersUpdate: number;

  // misc
  nlog = 0;

  constructor(w: number, h: number, t: number, data: IMovingCircleData) {
    this.h = h;
    this.w = w;

    this.cx = data.cx;
    this.cy = data.cy;
    this.cy = this.h / 2;

    this.d = data.d;
    this.color = data.color;

    this.nextUpdatersUpdate = t - 1;
  }

  updatePValues(t: number) {
    const amp = 140 + Math.random() * 140;
    const period = 2 + Math.random() * 3;

    // pcx
    if (this.cx < 100 || this.cx - this.w > -100) {
      // back to center
      console.log("Back to center");
      this.pcx = new PVInterpolate(
        [
          { t: t, v: this.cx },
          { t: t + 2.5, v: this.w / 2 },
        ],
        { easing: easeSinInOut, afterMode: "constant" }
      );
    } else {
      this.pcx = new PVSin({
        min: this.cx - amp,
        max: this.cx + amp,
        period,
        keyPoint: { t, v: this.cx },
      });
    }

    this.pcolor = new PVConstant(
      colorChoices01[Math.floor(Math.random() * colorChoices01.length)]
    );
  }

  updateUpdaters(t: number) {
    this.updatePValues(t);
    this.nextUpdatersUpdate += 3 + Math.random() * 3;
  }

  deltaTick(t: number, dt: number): void {
    if (t >= this.nextUpdatersUpdate) {
      this.updateUpdaters(t);
    }

    this.cx = this.pcx.v(t);
    this.color = this.pcolor.v(t);

    const ydelta = this.cy - this.h / 2;
    const cybump = this.pcybump.v(t);
    if (t > this.nextcybump) {
      console.log("CYBUMP");
      this.pcybump = new PVInterpolate(
        [
          { t: t, v: 0 },
          { t: t + 0.1, v: 1500 + Math.random() * 3000 },
          { t: t + 0.2, v: 0 },
        ],
        { easing: easeSinInOut, afterMode: "constant" }
      );
      this.nextcybump = t + 1.5 + Math.random() * 6;
    }

    this.acy = cybump - 20 * Math.sign(ydelta) * ydelta ** 2 + -1 * this.vcy;
    this.vcy += this.acy * dt;
    this.cy += this.vcy * dt;
    if (this.nlog < 10) {
      console.log(dt, this.acy, this.vcy, this.cy);
      this.nlog += 1;
    }
  }
}

type TMovingCirclesContext = {
  w: number;
  h: number;
  bgcolor: string;
  circles: MovingCircle[];
};

export function movingCircles() {
  const w = 600;
  const h = 90;

  const ctx0: TMovingCirclesContext = {
    w,
    h,
    bgcolor: resolveColor("zinc-500"),
    circles: [
      new MovingCircle(w, h, 0, {
        cx: w / 2,
        cy: h / 2,
        d: h / 2,
        color:
          colorChoices01[Math.floor(Math.random() * colorChoices01.length)],
      }),
    ],
  };

  function setup(p: p5, _ctx: TMovingCirclesContext) {
    p.createCanvas(w, h);
    p.frameRate(32);
  }

  function draw(
    p: p5,
    ctx: TMovingCirclesContext & { t: number; dt: number }
  ): string {
    p.background(ctx.bgcolor);

    for (const circle of ctx.circles) {
      drawCircle(p, circle);
    }
    return "";
  }

  function drawCircle(p: p5, circle: MovingCircle) {
    p.noStroke();
    p.fill(circle.color);
    p.circle(circle.cx, circle.cy, circle.d);
  }

  function updater(ctx: TMovingCirclesContext & { t: number; dt: number }) {
    for (const circle of ctx.circles) {
      circle.deltaTick(ctx.t, ctx.dt);
    }
    return ctx;
  }

  const runner = buildP5ContextRunner<TMovingCirclesContext>(
    ctx0,
    {
      setup,
      draw,
    },
    updater,
    { scale: 1 / 1000 }
  );

  return runner;
}
