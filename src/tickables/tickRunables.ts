import { ClockBase, IClock, ITimeTickable } from ".";

export type TickRunnableFunc<C = any> = (
  t: number,
  dt: number,
  ctx: C
) => string;

export interface ITickRunnable<C = any> {
  tickRun: TickRunnableFunc<C>;
}

export type TTickRunnableEngineOptions<C = any> = {
  clock?: IClock & ITimeTickable;
  init?: TickRunnableFunc<C>;
  handleDone?: (
    engine: TickRunnableEngine<C>,
    t: number,
    ctx:C,
    child: ITickRunnable<C>
  ) => ITickRunnable<C> | undefined;
};

const default_TTickRunnableEngineOptions: TTickRunnableEngineOptions = {};

export class TickRunnableEngine<C> implements ITimeTickable, IClock {
  private ctx: C;
  private children: ITickRunnable<C>[] = [];
  private opt: TTickRunnableEngineOptions<C>;
  private clock: IClock & ITimeTickable;
  private initialized = false;

  constructor(
    ctx: C,
    children: ITickRunnable<C>[],
    options: Partial<TTickRunnableEngineOptions> = {}
  ) {
    this.ctx = { ...ctx };
    this.children.push(...children);
    this.opt = { ...default_TTickRunnableEngineOptions, ...options };
    this.clock = this.opt.clock ?? new ClockBase();
  }

  timeTick(t: number): string {
    this.clock.timeTick(t);
    if (!this.initialized) {
      if (this.opt.init) {
        this.opt.init(this.t, this.dt, this.ctx);
      }
      this.initialized = true;
    }
    const doneChildren = [] as number[];
    console.log("Tick run Children:", this.children.length);
    for (let i = 0; i < this.children.length; i += 1) {
      const child = this.children[i];
      const r = child.tickRun(this.t, this.dt, this.ctx);
      if (r == "!done") {
        if (this.opt.handleDone) {
          const newChild = this.opt.handleDone(this, this.t, this.ctx, child);
          if (newChild != undefined) {
            this.children[i] = newChild;
          } else {
            doneChildren.push(i);
          }
        } else {
          doneChildren.push(i);
        }
      }
    }
    for (let i = doneChildren.length - 1; i >= 0; i -= 1) {
      this.children.splice(doneChildren[i], 1);
    }

    return "";
  }

  // children
  appendChild(child: ITickRunnable<C>) {
    this.children.push(child);
  }

  prependChild(child: ITickRunnable<C>) {
    this.children.unshift(child);
  }

  replaceChild(oldChild: ITickRunnable<C>, newChild: ITickRunnable<C>) {
    const index = this.children.indexOf(oldChild);
    if (index >= 0) {
      this.children[index] = newChild;
    }
  }

  deleteChild(child: ITickRunnable<C>) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }

  // clock delegation
  get t(): number {
    return this.clock.t;
  }

  get dt(): number {
    return this.clock.dt;
  }

  get started(): boolean {
    return this.clock.started;
  }

  get paused(): boolean {
    return this.clock.paused;
  }

  set paused(v: boolean) {
    this.clock.paused = v;
  }
}
