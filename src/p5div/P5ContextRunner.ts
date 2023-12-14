import p5 from "p5";
import { P5Runner } from "./P5Runner";
import {
  ContextUpdaterFunc,
  IContextRunner,
  TickableContextEngine,
} from "@src/segments/context";

export interface IP5ContextRunner<C = any> {
  setup(p: p5, ctx: C): void;
  draw(p: p5, ctx: C & { t: number; dt: number }): string;
}

export function buildP5ContextRunner<C>(
  ctx0: C,
  runner: IP5ContextRunner<C>,
  updater: ContextUpdaterFunc<C> | undefined = undefined
): P5Runner {

  let p5Instance: p5 | undefined;

  const _runner: IContextRunner<C> = {
    init(ctx: C) {
      if (p5Instance == undefined) {
        throw new Error("At this point, p5Instance should be defined!");
      }
      runner.setup(p5Instance, ctx);
    },

    run(ctx: C & { t: number; dt: number }): string {
      runner.draw(p5Instance!, ctx);
      return "";
    },
  };

  const engine = new TickableContextEngine(ctx0, _runner, updater);

  function setup(p: p5) {
    p5Instance = p;
  }

  function draw(p: p5) {
    engine.tick(p.millis());
  }

  return new P5Runner(setup, draw);
}
