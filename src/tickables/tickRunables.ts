import Heap from "heap-js";
import { ClockBase, IClock, ITimeTickable } from ".";

export type TickRunnableFunc<C = any> = (
  t: number,
  dt: number,
  ctx: C
) => undefined | string | EngineActionFunc<C>;

export type EngineActionFunc<C = any> = (
  engine: TickRunnableEngine<C>,
  child?: TickRunnable<C>
) => void;

export interface ITickRunnable<C = any> {
  tickRun: TickRunnableFunc<C>;
}

export type TickRunnable<C = any> = ITickRunnable<C> | TickRunnableFunc<C>;

export type TTickRunnableEngineOptions<C = any> = {
  clock?: IClock & ITimeTickable;
  init?: TickRunnableFunc<C>;
  handleDone?: (
    engine: TickRunnableEngine<C>,
    t: number,
    ctx: C,
    child: TickRunnable<C>
  ) => ITickRunnable<C> | undefined;
};

type TEvent<C> = {
  t: number;
  action: EngineActionFunc<C>;
  child?: TickRunnable<C>;
};

const default_TTickRunnableEngineOptions: TTickRunnableEngineOptions = {};

export class TickRunnableEngine<C> implements ITimeTickable, IClock {
  ctx: C | undefined;
  private children: { child: TickRunnable<C>; run: TickRunnableFunc<C> }[] = [];
  private opt: TTickRunnableEngineOptions<C>;
  private clock: IClock & ITimeTickable;
  private initialized = false;
  private events: Heap<TEvent<C>>;

  constructor(
    children: TickRunnable<C>[],
    options: Partial<TTickRunnableEngineOptions> = {}
  ) {
    this.children.push(...children.map((c) => this.adaptTickRunnable(c)));
    this.opt = { ...default_TTickRunnableEngineOptions, ...options };
    this.clock = this.opt.clock ?? new ClockBase();

    this.events = new Heap<TEvent<C>>((a, b) => a.t - b.t);
  }

  init(ctx0: C) {
    this.ctx = { ...ctx0 };
  }

  timeTick(t: number): string {
    this.clock.timeTick(t);

    if (this.ctx == undefined) {
      return "";
    }

    if (!this.initialized) {
      if (this.opt.init) {
        this.opt.init(this.t, this.dt, this.ctx);
      }
      this.initialized = true;
    }

    // run events
    while (this.events.peek() != undefined && this.events.peek()!.t <= this.t) {
      const e = this.events.pop()!;
      e.action(this, e.child);
    }

    // run childrens

    const doneChildren = [] as number[];
    const postActions: {
      action: EngineActionFunc<C>;
      child: TickRunnable<C>;
    }[] = [];

    for (let i = 0; i < this.children.length; i += 1) {
      const child = this.children[i];
      const r = child.run(this.t, this.dt, this.ctx);
      if (r == "!done") {
        if (this.opt.handleDone) {
          const newChild = this.opt.handleDone(
            this,
            this.t,
            this.ctx,
            child.child
          );
          if (newChild != undefined) {
            console.log("New Child:", i, child, newChild);
            this.children[i] = this.adaptTickRunnable(newChild);
          } else {
            doneChildren.push(i);
          }
        } else {
          doneChildren.push(i);
        }
      } else if (typeof r == "function") {
        postActions.push({ action: r, child: child.child });
      }
    }
    for (let i = doneChildren.length - 1; i >= 0; i -= 1) {
      this.children.splice(doneChildren[i], 1);
    }

    for (const postAction of postActions) {
      postAction.action(this, postAction.child);
    }

    return "";
  }

  //
  private adaptTickRunnable(tr: TickRunnable<C>): {
    child: TickRunnable<C>;
    run: TickRunnableFunc<C>;
  } {
    return typeof tr == "function"
      ? { child: tr, run: tr }
      : { child: tr, run: (t, dt, ctx) => tr.tickRun(t, dt, ctx) };
  }

  // children
  appendChild(child: TickRunnable<C>) {
    this.children.push(this.adaptTickRunnable(child));
  }

  prependChild(child: TickRunnable<C>) {
    this.children.unshift(this.adaptTickRunnable(child));
  }

  deleteChild(child: TickRunnable<C>) {
    const index = this.children.findIndex((c) => c.child == child);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }

  replaceChild(oldChild: TickRunnable<C>, newChild: TickRunnable<C>) {
    const index = this.children.findIndex((c) => c.child == oldChild);
    if (index >= 0) {
      this.children[index] = this.adaptTickRunnable(newChild);
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

  // events
  scheduleAction(
    t: number,
    action: EngineActionFunc<C>,
    item?: TickRunnable<C>
  ) {
    this.events.push({ t, action, child: item });
  }
}
