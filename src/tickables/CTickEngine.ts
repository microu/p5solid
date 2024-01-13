import Heap from "heap-js";
import {
  CTickable,
  CTickableFunc,
  ClockBase,
  ITickableClock,
  ctickableFunc,
} from "./tickables";

export type ChildResult = string;

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
  layers: string[];
  defaultLayer: string;
};

type TChildEntry<C> = {
  child: CTickable<C, ChildResult>;
  func: CTickableFunc<C, ChildResult>;
  deleted: boolean;
};

const default_CTickEngineOptions: CTickEngineOptions = {
  layers: [""],
  defaultLayer: "",
};

export class CTickEngine<C = any> implements ITickableClock {
  clock: ITickableClock;
  children: Map<string, TChildEntry<C>[]>;
  opt: CTickEngineOptions<C>;
  events: Heap<CTickEngineEvent<C>>;
  ctx?: C;
  initialized = false;

  // constructor + init

  constructor(
    children: (
      | CTickable<C, ChildResult>
      | [CTickable<C, ChildResult>, string]
    )[],
    options: Partial<CTickEngineOptions<C>> = {}
  ) {
    this.opt = { ...default_CTickEngineOptions, ...options };

    if (this.opt.layers.indexOf(this.opt.defaultLayer) < 0) {
      throw new Error(
        `Default layer "${this.opt.defaultLayer}" not in layers list`
      );
    }

    this.children = new Map();
    for (const l of this.opt.layers) {
      this.children.set(l, []);
    }

    console.log("CHILDREN:", this.children);

    for (const child of children) {
      if (Array.isArray(child)) {
        const [c, layer] = child;
        if (this.children.has(layer)) {
          this.children.get(layer)!.push(this._childEntry(c));
        } else {
          throw new Error(`Unknown layer: "${this.opt.defaultLayer}"`);
        }
      } else {
        this.children.get(this.opt.defaultLayer)!.push(this._childEntry(child));
      }
    }

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
    for (const [_layerName, layer] of this.children) {
      for (const c of layer) {
        if (!c.deleted) {
          const r = c.func(this.t, this.dt, this.ctx);
          if (r == "!done") {
            c.deleted = true;
          }
        }
      }
    }

    // remove deleted
    for (const [_layerName, layer] of this.children) {
      for (let i = layer.length - 1; i >= 0; i -= 1) {
        const entry = layer[i];
        if (entry.deleted) {
          layer.splice(i, 1);
        }
      }
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

  // children
  addChild(child: CTickable<C, ChildResult>, layer?: string) {
    layer ??= this.opt.defaultLayer;
    const l = this.children.get(layer);
    if (l) {
      l.push(this._childEntry(child));
    }
  }

  delChild(child: CTickable<C, ChildResult>) {
    const r = this._findChild(child);
    if (r != undefined) {
      const entry = r[0][r[1]];
      entry.deleted = true;
    }
  }

  _findChild(
    child: CTickable<C, ChildResult>
  ): [TChildEntry<C>[], number] | undefined {
    for (const [_layerName, layer] of this.children) {
      const index = layer.findIndex((c) => c.child == child);
      if (index >= 0) {
        return [layer, index];
      }
    }
    return undefined;
  }

  _childEntry(child: CTickable<C, ChildResult>): TChildEntry<C> {
    return { child, func: ctickableFunc(child), deleted: false };
  }

  // events
  scheduleAction(
    t: number,
    action: CTickEngineActionFunc<C>,
    item?: CTickable<C, ChildResult>
  ) {
    this.events.push({ t, action, child: item });
  }
}
