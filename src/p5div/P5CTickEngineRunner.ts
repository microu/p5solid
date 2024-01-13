import p5 from "p5";
import { P5Runner } from "./P5Runner";
import { CTickEngine } from "@src/tickables/CTickEngine";

export interface IP5Context {
  p: p5;
}

export type TP5CTickEngineRunnerOptions = {
  size?: { w: number; h: number };
  frameRate?: number;
  mouseClicked?: (p: p5, e?: Object) => void;
};

export function p5CTickEngineRunner<C extends IP5Context>(
  engine: CTickEngine<C>,
  ctx0: Omit<C, "p">,
  options: TP5CTickEngineRunnerOptions = {}
): P5Runner {
  function setup(p: p5) {
    engine.init({ ...ctx0, p: p } as C);
    if (options.size != undefined) {
      p.createCanvas(options.size.w, options.size.h);
    }

    if (options.frameRate != undefined) {
      p.frameRate(options.frameRate);
    }
  }

  function draw(p: p5) {
    engine.tick(p.millis());
  }

  function mouseClicked(p: p5, e?: Object) {
    if (options.mouseClicked) {
      options.mouseClicked(p, e);
    }
  }

  return new P5Runner({ setup, draw, mouseClicked });
}
