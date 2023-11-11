import p5 from "p5";
import { ISketchHandler, SketchHandlerBase } from "../SketchHandlers";
import twconf from "../twconf";
import { ISketchItem, TDrawItemContext } from "./sketchItems";

type TParticlesSketchOptions = {
  w: number;
  h: number;
  background: string;
  colorA: string;
};

type TParticlesSketchArg = Partial<TParticlesSketchOptions>;

const DEFAULT_OPTIONS: TParticlesSketchOptions = {
  w: 500,
  h: 500,
  background: "slate-800",
  colorA: "amber-400",
};

function resolveColor(c: string): string {
  const cc = twconf.color(c);
  return cc == undefined ? c : cc;
}

export function particlesSketch(arg: TParticlesSketchArg): ISketchHandler {
  const opt: TParticlesSketchOptions = {
    ...DEFAULT_OPTIONS,
    ...arg,
  };

  opt.background = resolveColor(opt.background);
  opt.colorA = resolveColor(opt.colorA);

  const pSystems = [
    new ParticleSystem(50, 50, 15, resolveColor("rose-600")),
    new ParticleSystem(300, 50, 22, resolveColor("emerald-700")),
  ] as ParticleSystem[];

  const context: TDrawItemContext = {
    t0: 0,
    t: 0,
    dt: 0,
    params: {},
  };

  function setup(p: p5) {
    p.createCanvas(opt.w, opt.h);
    p.frameRate(32);

    // init context
    context.t0 = p.millis();
    context.t = 0;
    context.dt = 0;
  }

  function draw(p: p5) {
    // update context
    const t = p.millis();
    const dt = t - context.t;
    context.t = t;
    context.dt = dt;
    p.background(opt.background);
    for (const ps of pSystems) {
      ps.draw(p, context);
    }
  }

  return new SketchHandlerBase(setup, draw);
}

class ParticleSystem implements ISketchItem {
  private nextPush: number;
  particles: Particle[];
  constructor(
    private x: number,
    private y: number,
    private d: number,
    private color: string
  ) {
    this.particles = [];
    this.nextPush = 0;
  }

  draw(p: p5, ctx?: TDrawItemContext): string {
    if (ctx == undefined) {
      throw new Error(`Context needed!`);
    }

    if (ctx.t >= this.nextPush) {
      const direction = p.randomGaussian(p.PI, p.PI);
      const vx = 50 * Math.sin(direction);
      const vy = 50 * Math.cos(direction);

      this.particles.push(
        new Particle(this.x, this.y, vx, vy, -vx / 4, 60, this.d, this.color)
      );
      this.nextPush = ctx.t + 20 + Math.random() * 40;
      console.log("N:", this.particles.length);
    }

    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const particle = this.particles[i];
      if (particle.done()) {
        this.particles.splice(i, 1);
        console.log("DONE");
      } else {
        particle.draw(p, ctx);
      }
    }
    return "";
  }
}

// x(t) = x0 + v0.t + a.t2/2.

class Particle implements ISketchItem {
  private duration: number;
  private age = 0;
  private _done = false;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  t1: number;
  constructor(
    x0: number,
    y0: number,
    vx0: number,
    vy0: number,
    ax: number,
    ay: number,
    private d: number,
    private color: string
  ) {
    this.x = x0;
    this.y = y0;
    this.vx = vx0;
    this.vy = vy0;
    this.ax = ax;
    this.ay = ay;
    this.t1 = 0;

    this.duration = 5;
  }

  draw(p: p5, ctx?: TDrawItemContext): string {
    if (ctx == undefined) {
      throw new Error(`Context needed!`);
    }

    // MOVE
    const t = ctx.t / 1000;
    const dt = ctx.dt / 1000;

    this.vx += this.ax * dt;
    this.vy += this.ay * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.t1 = t;

    if (this.age <= this.duration) {
      const alpha = coefToHexString((this.duration -this.age) / this.duration);
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
