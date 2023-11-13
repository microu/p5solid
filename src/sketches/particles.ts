import p5 from "p5";
import { TParticlesContext } from "./particlesTypes";
import { ISketchItem } from "./sketchItems";

export type ParticleFeedbackFunc = (
  m: number,
  x: number,
  y: number,
  vx: number,
  vy: number
) => [fx: number, fy: number];

export class Particle implements ISketchItem {
  private duration: number;
  private age = 0;
  private _done = false;
  x: number;
  y: number;
  vx: number;
  vy: number;
  t1: number;
  m: number;

  constructor(
    m: number,
    x0: number,
    y0: number,
    vx0: number,
    vy0: number,
    private d: number,
    private color: string,
    private feedback?: ParticleFeedbackFunc
  ) {
    this.m = m;
    this.x = x0;
    this.y = y0;
    this.vx = vx0;
    this.vy = vy0;
    this.t1 = 0;
    this.duration = 5;
  }

  draw(p: p5, ctx?: TParticlesContext): string {
    if (ctx == undefined) {
      throw new Error(`Context needed!`);
    }

    // MOVE
    const t = ctx.t / 1000;
    const dt = ctx.dt / 1000;

    const [fbx, fby] = this.feedback
      ? this.feedback(this.m, this.x, this.y, this.vx, this.vy)
      : [0, 0];
    const fx = 0 + ctx.xforce + fbx;
    const fy = this.m * ctx.gravity + ctx.yforce + fby;

    const ax = fx / this.m;
    const ay = fy / this.m;

    this.vx += ax * dt;
    this.vy += ay * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.t1 = t;

    if (this.age <= this.duration) {
      const alpha = coefToHexString((this.duration - this.age) / this.duration);
      p.noStroke();
      p.fill(this.color + alpha);
      p.circle(this.x, this.y, this.d);
    } else {
      this._done = true;
    }

    this.age += dt;
    return "";
  }

  done() {
    return this._done;
  }
}

function coefToHexString(coef: number): string {
  if (coef < 0) {
    coef = 0;
  } else if (coef >= 1) {
    coef = 0.999999;
  }
  const r = Math.floor(256 * coef).toString(16);
  return r.length > 1 ? r : "0" + r;
}
