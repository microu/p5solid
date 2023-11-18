import p5 from "p5";

export interface IP5Drawable<TContext extends IP5TimeContext = P5TimeContext> {
  draw(p: p5, ctx: TContext): string;
}

export interface IP5Item<TContext extends IP5TimeContext = P5TimeContext>
  extends IP5Drawable<TContext> {}

export interface IP5TimeContext {
  t0: number; // start of drawing (ms) in p5 time
  t: number; // time of drawing: ms since t0
  dt: number; // time (ms) since last draw
}

export class P5TimeContext implements IP5TimeContext {
  t0: number;
  t: number;
  dt: number;
  constructor() {
    this.t0 = -1;
    this.t = 0;
    this.dt = 0;
  }

  draw(p: p5) {
    if (this.t0 < 0) {
      this.t0 = p.millis();
      this.t = 0;
      this.dt = 0;
    } else {
      const t = p.millis() - this.t0;
      this.dt = t - this.t;
      this.t = t;
    }
  }

  update(other: IP5TimeContext) {
    this.t0 = other.t0;
    this.t = other.t;
    this.dt = other.dt;
  }
}
