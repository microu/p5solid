import { identity } from "@src/utils";
import { ClockBase, ITickable } from "./tickables";

export interface IContextRunner<C = any> {
  init(ctx: C): void;
  run(ctx: C & { t: number; dt: number }): string;
}

export type ContextUpdaterFunc<C = any> = (
  ctx: C & { t: number; dt: number }
) => C & { t: number; dt: number };

export class TickableContextEngine<C = any> implements ITickable {
  private ctx: C & { t: number; dt: number };
  private runner: IContextRunner<C>;
  private updater: ContextUpdaterFunc<C>;
  private initialized = false;
  private _done = false;
  clock: ClockBase;
  constructor(
    ctx0: C,
    runner: IContextRunner<C>,
    updater: ContextUpdaterFunc<C> | undefined = undefined
  ) {
    this.ctx = { ...ctx0, t: 0, dt: 0 };
    this.runner = runner;
    this.updater = updater ?? identity<C & { t: number; dt: number }>;
    this.clock = new ClockBase();
  }

  tick(t: number): void {
    this.clock.tick(t);
    this.ctx.t = this.clock.t;
    this.ctx.dt = this.clock.dt;

    if (!this.initialized) {
      this.runner.init(this.ctx);
      this.initialized = true;
    }

    if (this._done) return;

    this.ctx = this.updater(this.ctx);
    const r = this.runner.run(this.ctx);
    this._done = r == "!done";
  }

  done() {
    return this._done;
  }
}
