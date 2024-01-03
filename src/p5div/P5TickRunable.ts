import { TTickRunnableEngineOptions, TickRunnable, TickRunnableEngine } from "@src/tickables";
import p5 from "p5";
import { P5Runner } from "./P5Runner";

export type ClockContext<T> = T & { t: number; dt: number };

export interface IP5Context {
  p: p5;
}

export interface IP5Context1 {
  p?: p5;
}


export type TP5TickRunnableEngineOptions = {
  size?: { w: number; h: number };
  frameRate?: number;
};

export function p5TickRunnableEngineRunner<C extends IP5Context>(
  engineBuilder: (p: p5) => TickRunnableEngine<C>,
  options: TP5TickRunnableEngineOptions = {}
): [P5Runner, () => TickRunnableEngine<C>] {
  let engine: TickRunnableEngine<C>;

  function setup(p: p5) {
    engine = engineBuilder(p);
    if (options.size != undefined) {
      p.createCanvas(options.size.w, options.size.h);
    }

    if (options.frameRate != undefined) {
      p.frameRate(options.frameRate);
    }
  }

  function draw(p: p5) {
    engine.timeTick(p.millis());
  }

  return [new P5Runner(setup, draw), () => engine!];
}

export function p5TickRunnableEngineRunner1<C extends IP5Context1>(
  engine: TickRunnableEngine<C>,
  options: TP5TickRunnableEngineOptions = {}
): P5Runner {

  function setup(p: p5) {
    engine.ctx.p = p;
    if (options.size != undefined) {
      p.createCanvas(options.size.w, options.size.h);
    }

    if (options.frameRate != undefined) {
      p.frameRate(options.frameRate);
    }
  }

  function draw(p: p5) {
    engine.timeTick(p.millis());
  }

  return new P5Runner(setup, draw);
}

