import Heap from "heap-js";
import {
  CTickable,
  CTickableFunc,
  ClockBase,
  ITickableClock,
  ctickableFunc,
} from "./tickables";

type ChildResult = string;

export type CTickEngineActionFunc<C = any> = (
  engine: CTickEngine<C>,
  child?: CTickable<C, ChildResult>
) => void;

type CTickEngineEvent<C> = {
  t: number;
  action: CTickEngineActionFunc<C>;
  child?: CTickable<C, ChildResult>;
};

export type CTickEngineOptions<C = any> = {
  clock?: ITickableClock;
  init?: CTickEngineActionFunc<C>;
};

const default_CTickEngineOptions: CTickEngineOptions = {};

export class CTickEngine<C = any> implements ITickableClock {
  clock: ITickableClock;
  children: {
    child: CTickable<C, ChildResult>;
    func: CTickableFunc<C, ChildResult>;
  }[] = [];
  opt: CTickEngineOptions<C>;
  events: Heap<CTickEngineEvent<C>>;
  ctx?: C;
  initialized = false;

  // constructor + init

  constructor(
    children: CTickable<C, ChildResult>[],
    options: Partial<CTickEngineOptions<C>> = {}
  ) {
    this.children.push(
      ...children.map((child) => ({ child: child, func: ctickableFunc(child) }))
    );
    this.opt = { ...default_CTickEngineOptions, ...options };
    this.clock = this.opt.clock ?? new ClockBase();
    this.events = new Heap<CTickEngineEvent<C>>((a, b) => a.t - b.t);
  }

  init(ctx0: C) {
    this.ctx = { ...ctx0 };
  }

  // TICK
  tick(t: number): string {
    this.clock.tick(t);
    if (this.ctx == undefined) {
      return "";
    }

    if (!this.initialized) {
      if (this.opt.init) {
        this.opt.init(this);
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

    for (let i = 0; i < this.children.length; i += 1) {
      const child = this.children[i];
      const r = child.func(this.t, this.dt, this.ctx);
      if (r == "!done") {
        doneChildren.push(i);
      }
    }

    for (let i = doneChildren.length - 1; i >= 0; i -= 1) {
      this.children.splice(doneChildren[i], 1);
    }

    return "";
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
