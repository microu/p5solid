import { ClockBase, ITickRunnable, ITimeTickableClock } from "@src/tickables";
import p5 from "p5";
import { P5Runner } from "./P5Runner";

export type ClockContext<T> = T & { t: number; dt: number };

export function buildP5TickRunnable<C = any>(opt: {
  ctx0: C;
  setup?: (p: p5, ctx: C) => void;
  run?: ITickRunnable<ClockContext<C>>;
  draw: (p: p5, ctx: ClockContext<C>) => void;
  clock?: ITimeTickableClock;
}): P5Runner {
  const cctx: ClockContext<C> = { ...opt.ctx0, t: 0, dt: 0 };
  const clock: ITimeTickableClock = opt.clock ?? new ClockBase();

  function setup(p: p5): void {
    if (opt.setup) {
      opt.setup(p, opt.ctx0);
    }
  }

  function draw(p: p5): void {
    clock.timeTick(p.millis());
    cctx.t = clock.t;
    cctx.dt = clock.dt;
    if (opt.run) {
      opt.run.tickRun(cctx.t, cctx.dt, cctx);
    }
    opt.draw(p, cctx);
  }

  return new P5Runner(setup, draw);
}
