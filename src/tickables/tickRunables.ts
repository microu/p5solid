import Heap from "heap-js";
import { ClockBase, IClock, ITickable } from ".";

export type EngineTickableFunc<C = any> = (
  t: number,
  dt: number,
  ctx: C
) => undefined | string | EngineActionFunc<C>;

export interface IEngineTickable<C = any> {
  ctick: EngineTickableFunc<C>;
}

export type EngineTickable<C = any> = IEngineTickable<C> | EngineTickableFunc<C>;

export function engineTickableFunc<C>(ct: EngineTickable<C>): EngineTickableFunc<C> {
  return typeof ct == "function" ? ct : (t, dt, ctx) => ct.ctick(t, dt, ctx);
}

export type EngineActionFunc<C = any> = (
  engine: TickRunnableEngine<C>,
  child?: EngineTickable<C>
) => void;

export type TTickRunnableEngineOptions<C = any> = {
  clock?: IClock & ITickable;
  init?: EngineTickableFunc<C>;
  handleDone?: (
    engine: TickRunnableEngine<C>,
    t: number,
    ctx: C,
    child: EngineTickable<C>
  ) => IEngineTickable<C> | undefined;
};

type TEvent<C> = {
  t: number;
  action: EngineActionFunc<C>;
  child?: EngineTickable<C>;
};

const default_TTickRunnableEngineOptions: TTickRunnableEngineOptions = {};

export class TickRunnableEngine<C> implements ITickable, IClock {
  ctx: C | undefined;
  private children: { child: EngineTickable<C>; run: EngineTickableFunc<C> }[] = [];
  private opt: TTickRunnableEngineOptions<C>;
  private clock: IClock & ITickable;
  private initialized = false;
  private events: Heap<TEvent<C>>;

  constructor(
    children: EngineTickable<C>[],
    options: Partial<TTickRunnableEngineOptions> = {}
  ) {
    this.children.push(...children.map((c) => this.adaptCTickable(c)));
    this.opt = { ...default_TTickRunnableEngineOptions, ...options };
    this.clock = this.opt.clock ?? new ClockBase();

    this.events = new Heap<TEvent<C>>((a, b) => a.t - b.t);
  }

  init(ctx0: C) {
    this.ctx = { ...ctx0 };
  }

  tick(t: number): string {
    this.clock.tick(t);

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
      child: EngineTickable<C>;
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
            this.children[i] = this.adaptCTickable(newChild);
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

  // children
  appendChild(child: EngineTickable<C>) {
    this.children.push(this.adaptCTickable(child));
  }

  prependChild(child: EngineTickable<C>) {
    this.children.unshift(this.adaptCTickable(child));
  }

  deleteChild(child: EngineTickable<C>) {
    const index = this.children.findIndex((c) => c.child == child);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }

  replaceChild(oldChild: EngineTickable<C>, newChild: EngineTickable<C>) {
    const index = this.children.findIndex((c) => c.child == oldChild);
    if (index >= 0) {
      this.children[index] = this.adaptCTickable(newChild);
    }
  }

  private adaptCTickable(tr: EngineTickable<C>): {
    child: EngineTickable<C>;
    run: EngineTickableFunc<C>;
  } {
    return { child: tr, run: engineTickableFunc(tr) }
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
  scheduleAction(t: number, action: EngineActionFunc<C>, item?: EngineTickable<C>) {
    this.events.push({ t, action, child: item });
  }
}
