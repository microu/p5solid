import { p5CTickEngineRunner } from "@src/p5div/P5CTickEngineRunner";
import { P5Runner } from "@src/p5div/P5Runner";
import { CTickEngine, ChildResult } from "@src/tickables/CTickEngine";
import p5 from "p5";
import { resolveColor } from "../twconf";
import {
  CTickable,
  CTickableFunc,
  ClockBase,
  ICTickable,
} from "@src/tickables";

class MovingPoint implements ICTickable<TContext> {
  x: number;
  y: number;
  fqx: number;
  fqy: number;

  constructor(
    readonly t0: number,
    readonly x0: number,
    readonly y0: number,
    readonly h: number
  ) {
    this.x = x0;
    this.y = y0;
    this.fqx = 0.3 * Math.random() * 0.6;
    this.fqy = 0.6 * Math.random() * 0.6;
  }

  ctick(t: number, _dt: number, _ctx: TContext) {
    this.x = this.x0 + Math.sin(2 * Math.PI * this.fqx * t) * this.h;
    this.y = this.y0 + (Math.sin(2 * Math.PI * this.fqy * t) * this.h) / 3;
    return "";
  }
}

type TContext = {
  p: p5;
  bgcolor: string;
  lineColor: string;
  points: MovingPoint[];
};

export function tickRunnableSampleC(
  w: number,
  h: number
): [P5Runner, CTickEngine<TContext>] {
  const points = [
    new MovingPoint(0, w / 4, h / 3, h),
    new MovingPoint(0, (w * 3) / 4, h / 2, h),
    new MovingPoint(0, w / 4, (h * 2) / 3, h),
  ];

  const ctx0: Omit<TContext, "p"> = {
    bgcolor: resolveColor("orange-800"),
    lineColor: resolveColor("rose-600"),
    points,
  };

  const drawBg: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    ctx.p.background(ctx.bgcolor);
    return "";
  };

  const drawLine: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    const p = ctx.p;
    p.noFill();
    p.stroke(ctx.lineColor);
    p.strokeWeight(3);
    for (let i = 0; i < ctx.points.length - 1; i += 1) {
      const p0 = ctx.points[i];
      const p1 = ctx.points[i + 1];
      p.line(p0.x, p0.y, p1.x, p1.y);
    }
    return "";
  };

  const clock = new ClockBase({ scale: 1 / 1000 });
  const pointChildren: [MovingPoint, string][] = points.map((p) => [
    p,
    "animate",
  ]);

  const engine = new CTickEngine([[drawBg, "bg"], ...pointChildren, drawLine], {
    layers: ["bg", "animate", "draw"],
    defaultLayer: "draw",
    clock: clock,
  });

  const runner = p5CTickEngineRunner<TContext>(engine, ctx0, {
    size: { w, h },
    mouseClicked() {
      clock.paused = !clock.paused;
    },
  });

  let nextPointLeft = false;

  function changePoints(e: CTickEngine<TContext>) {
    const newPoint = nextPointLeft
      ? new MovingPoint(e.t, w / 4, h / 2, h)
      : new MovingPoint(e.t, (w * 3) / 4, h / 2, h);
    nextPointLeft = !nextPointLeft;
    if (e.ctx!.points.length > 9) {
      e.ctx!.points.splice(0, 1);
      engine.delChild(points[0]);
    }
    engine.addChild(newPoint, "animate");
    e.ctx!.points.push(newPoint);
    e.scheduleAction(e.t + 5, changePoints);
  }

  engine.scheduleAction(5, changePoints);

  return [runner, engine];
}
