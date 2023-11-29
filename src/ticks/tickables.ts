export interface ITickable {
  tick(t: number): void;
}

export interface IClock {
  readonly started: boolean;
  readonly t: number;
  paused: boolean;
}

export interface IParentClock extends IClock {
  addChild(child: ITickable): void;
  removeChild(child: ITickable): void;
}
type TClockBaseOptions = {
  tick0?: number;
  // origin in ticker scale (t0 in clock scale).
  // if undefined will be thetime of first tick
  t0: number;
  // t0 in ticker scale (0 in clock scale).
  // if undefined will be thetime of first tick

  scale: number;
  // time scale
};
const DEFAULT_TClockBaseOptions: TClockBaseOptions = {
  tick0: undefined,
  t0: 0,
  scale: 1,
};

export class ClockBase implements IClock, ITickable {
  private _state: "" | "initialized" | "started" | "unpaused" | "paused" = "";
 
  private _tick0: number = 0; // clock origin (ticker scale)
  private _t0: number = 0; // clock origin (clock scale)
  private _scale: number = 1;

  private _t: number = 0; // current time (clock scale) if _started
  private options: TClockBaseOptions;

  constructor(options: Partial<TClockBaseOptions> = {}) {
    this.options = { ...DEFAULT_TClockBaseOptions, ...options };
    this._scale = this.options.scale;
  }

  tick(t: number): void {
    if (this._state == "") {
      this._tick0 = this.options.tick0 ?? t;
      this._t0 = this.options.t0;
      this._state = "initialized";
    }
    
    if (this._state == "unpaused") {
      this._tick0 = t;
      this._t0 = this._t;
      this._state = "started";
    }

    if (t >= this._tick0) {
      const new_t = this._t0 + (t - this._tick0) * this._scale;
      if (this.started && new_t <= this.t) {
        throw new Error(
          `Tick times must be stricly increasing but  ${new_t} <=  ${this._t}`
        );
      }
      if (!this.paused) {
        this._t = new_t;
      }
      this._state = "started";
    }
  }

  get t() {
    return this._t;
  }

  get started() {
    return this._state == "started";
  }

  get paused() {
    return this._state == "paused";
  }
  set paused(v: boolean) {
    if (this.paused == v) return;
    this._state = v ? "paused" : "unpaused"
  }
}

export type TParentClockOptions = TClockBaseOptions;
const DEFAULT_TParentClockOptions = DEFAULT_TClockBaseOptions;

export class ParentClock implements ITickable, IParentClock, IClock {
  private _t: number;
  private _state: "" | "initialized" | "started" = "";
  private _parent_t = 0;
  private _tick0: number = 0;
  private _children: ITickable[] = [];

  options: TParentClockOptions;
  private _paused = false;

  constructor(options: Partial<TParentClockOptions> = {}) {
    this.options = { ...DEFAULT_TParentClockOptions, ...options };
    this._t = 0;
  }

  addChild(child: ITickable): void {
    this._children.push(child);
  }
  removeChild(child: ITickable): void {
    const pos = this._children.indexOf(child);
    if (pos >= 0) {
      this._children.splice(pos, 1);
    }
  }

  tick(t: number): void {
    if (this._state == "") {
      this._tick0 = this.options.tick0 ?? t;
      this._state = "initialized";
    }

    if (this.started && t <= this._parent_t) {
      throw new Error(
        `Tick times must be stricly increasing : ${t} <=  ${this._parent_t}`
      );
    }

    if (t >= this._tick0) {
      const ct = (t - this._tick0) * this.options.scale;
      this._update(t, ct);
    }
  }

  private _update(parent_t: number, t: number) {
    this._state = "started";
    this._parent_t = parent_t;
    this._t = t;

    for (const child of this._children) {
      child.tick(this.t);
    }
  }

  get t() {
    return this._t;
  }
  get started() {
    return this._state == "started";
  }

  get paused() {
    return this._paused;
  }

  set paused(v: boolean) {
    if (this._paused == v) return;
    this._paused = v;
  }
}
