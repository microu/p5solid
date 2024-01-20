import { p5CTickEngineRunner } from "@src/p5div/P5CTickEngineRunner";
import { P5Runner } from "@src/p5div/P5Runner";
import { CTickEngine } from "@src/tickables/CTickEngine";
import p5 from "p5";
import { resolveColor } from "../twconf";
import { CTickableFunc, ClockBase, ICTickable } from "@src/tickables";
import { NumberSegments } from "../utils/geometry";

class MovingPoint implements ICTickable<TContext> {
  x: number;
  y: number;
  fqx: number;
  fqy: number;
  zonex = -1;
  zoney = -1;

  constructor(
    readonly t0: number,
    readonly x0: number,
    readonly y0: number,
    readonly r: number
  ) {
    this.x = x0;
    this.y = y0;
    this.fqx = 0.3 * Math.random() * 0.6;
    this.fqy = 0.6 * Math.random() * 0.6;
  }

  ctick(t: number, _dt: number, _ctx: TContext) {
    this.x = this.x0 + Math.sin(2 * Math.PI * this.fqx * t) * this.r;
    this.y = this.y0 + Math.sin(2 * Math.PI * this.fqy * t) * (this.r / 2);
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

  const nXSegments = 6;
  const xlimits = Array.from(
    { length: nXSegments },
    (_x, i) => (i * w) / nXSegments
  );
  const xSegments = new NumberSegments(xlimits, (i) => (i < 0 ? 0 : i));

  const killPoints: CTickableFunc<TContext, string> = (_t, _dt, ctx) => {
    const zoneCount = Array.from({ length: nXSegments }, () => 0);

    for (const p of ctx.points) {
      p.zonex = xSegments.segment(p.x0);
      zoneCount[p.zonex] += 1;
    }

    for (let i = ctx.points.length - 1; i >= 0; i -= 1) {
      const p = ctx.points[i];
      if (zoneCount[p.zonex] > 2) {
        ctx.points.splice(i, 1);
        zoneCount[p.zonex] -= 1;
      }
    }
    ctx.points.sort((pa, pb) => pa.y0 - pb.y0);
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

  const engine = new CTickEngine(
    [["bg", drawBg], ["animate", killPoints], ["points", points], drawLine],
    {
      layers: ["bg", "animate", "points", "draw"],
      defaultLayer: "draw",
      clock: clock,
    }
  );

  const runner = p5CTickEngineRunner<TContext>(engine, ctx0, {
    size: { w, h },
    mouseClicked() {
      clock.paused = !clock.paused;
    },
  });

  function addPoint(e: CTickEngine<TContext>) {
    const newPoint = new MovingPoint(
      e.t,
      w * 0.1 + Math.random() * 0.8 * w,
      h * 0.2 + Math.random() * 0.6 * h,
      h / 2
    );
    e.ctx!.points.push(newPoint);
    e.scheduleAction(e.t + 1, addPoint);
  }

  engine.scheduleAction(2, addPoint);

  return [runner, engine];
}
