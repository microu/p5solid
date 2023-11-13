import p5 from "p5";
import chroma from "chroma-js";
import { ISketchHandler, SketchHandlerBase } from "../SketchHandlers";
import twconf from "../twconf";
import { TParticlesContext } from "./particlesTypes";
import { ParticleSystemA } from "./particlesSystemA";
import { CreateParticleFunc, ParticleSystemB } from "./particlesSystemB";
import { Particle } from "./particles";
import { IContextParams } from "../context/values";

type TParticlesSketchOptions = {
  w: number;
  h: number;
  background: string;
  colorA: string;
};

type TParticlesSketchArg = Partial<TParticlesSketchOptions>;

const DEFAULT_OPTIONS: TParticlesSketchOptions = {
  w: 480,
  h: 480,
  background: "slate-800",
  colorA: "amber-400",
};

type TParticleSystemEntry = {
  ps: ParticleSystemA | ParticleSystemB;
  colora: chroma.Color;
  colorb: chroma.Color;
  x: number;
  xmin: number;
  xmax: number;
  period: number;
  params?: IContextParams;
};

function resolveColor(c: string): string {
  const cc = twconf.color(c);
  return cc == undefined ? c : cc;
}

function resolveChromaColor(c: string): chroma.Color {
  return chroma(resolveColor(c));
}

export function particlesSketch(arg: TParticlesSketchArg): ISketchHandler {
  const opt: TParticlesSketchOptions = {
    ...DEFAULT_OPTIONS,
    ...arg,
  };

  const createParticle001: CreateParticleFunc = (
    x: number,
    y: number,
    p: p5,
    ctx: TParticlesContext
  ) => {
    const theta = (ctx.t * 2 * Math.PI) / 10_000;
    const a = p.max(10, p.randomGaussian(80, 20));
    const vx = Math.sin(theta) * a;
    const vy = Math.sin(theta) * a;
    return new Particle(
      10,
      x,
      y,
      vx,
      vy,
      8,
      resolveColor("red-700"),
      (m, x, y, vx, vy) => [-vx, 0]
    );
  };


  
  opt.background = resolveColor(opt.background);
  opt.colorA = resolveColor(opt.colorA);

  const pSystems: TParticleSystemEntry[] = [
    {
      ps: new ParticleSystemA(160, 40, 15, resolveColor("rose-600")),
      colora: resolveChromaColor("rose-800"),
      colorb: resolveChromaColor("purple-400"),
      period: 10_000,
      x: 0,
      xmin: 0,
      xmax: 0,
    },
    {
      ps: new ParticleSystemA(320, 40, 22, resolveColor("emerald-700")),
      colora: resolveChromaColor("emerald-500"),
      colorb: resolveChromaColor("slate-300"),
      period: 22_000,
      x: 0,
      xmin: 0,
      xmax: 0,
    },
    {
      ps: new ParticleSystemB(240, 120, createParticle001),
      colora: resolveChromaColor("emerald-500"),
      colorb: resolveChromaColor("slate-300"),
      period: 15_000,
      x: 240,
      xmin: 60,
      xmax: 420,

    },
  ];

  const context: TParticlesContext = {
    t0: 0,
    t: 0,
    dt: 0,
    gravity: 50,
    xforce: 0,
    yforce: 0,

    params: {},
  };

  let xforceSign = 0;

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
    context.gravity = 50; //+ 30 * Math.sin((t * Math.PI) / 9000);
    context.params = {};

    if (context.xforce == 0) {
      if (Math.random() < 0.005) {
        xforceSign = Math.random() > 0.5 ? 1 : -1;
        context.xforce = 500 * xforceSign;
        console.log("---->");
      }
    } else {
      console.log("---->", context.xforce);
      context.xforce -= 50 * xforceSign;
      if (context.xforce * xforceSign < 0) {
        context.xforce = 0;
      }
    }

    p.background(opt.background);
    for (const r of pSystems) {
      // animate color
      const k = (Math.sin(((Math.PI * 2) / r.period) * context.t) + 1) / 2;
      // animate x
      if (r.xmin != r.xmax) {
        r.x = r.xmin + k * (r.xmax - r.xmin);
      }
      context.params = { color: chroma.mix(r.colora, r.colorb, k), x: r.x };
      r.ps.draw(p, context, r.params);
    }
  }

  return new SketchHandlerBase(setup, draw);
}
