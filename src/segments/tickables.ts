export interface ITickable {
  tick(t: number): void;
}

export interface IClock {
  readonly t: number;
  readonly started: boolean;
  paused: boolean;
}

export interface IDeltaClock extends IClock {
  readonly dt: number;
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

export class ClockBase implements IDeltaClock, ITickable {
  private _state:
    | ""
    | "initialized"
    | "started"
    | "pause_requested"
    | "paused"
    | "unpaused" = "";

  private _tick0: number = 0; // clock origin (ticker scale)
  private _t0: number = 0; // clock origin (clock scale)
  private _scale: number = 1;

  private _t: number = 0; // current time (clock scale) if _started
  private _dt: number = 0; // delta with previous tick (clock scale) if started_

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

    if (this._state == "pause_requested") {
      this._state = "paused";
    }

    if (t >= this._tick0) {
      const new_t = this._t0 + (t - this._tick0) * this._scale;
      if (this.started && new_t < this.t) {
        throw new Error(
          `Tick times must be increasing but  ${new_t} <  ${this._t}`
        );
      }
      if (!this.paused) {
        this._dt = new_t - this._t;
        this._t = new_t;
        this._state = "started";
      }
    }
  }

  get t() {
    return this._t;
  }

  get dt() {
    return this._dt;
  }

  get started() {
    return this._state != "" && this._state != "initialized";
  }

  get paused() {
    return this._state == "paused" || this._state == "pause_requested";
  }

  set paused(v: boolean) {
    if (this.paused == v) return;

    if (v) {
      this._state = "pause_requested";
    } else {
      this._state = this._state == "pause_requested" ? "started" : "unpaused";
    }
  }

  get state() {
    return this._state;
  }
}

export type TParentClockOptions = TClockBaseOptions;

export class ParentClock
  extends ClockBase
  implements ITickable, IParentClock, IClock
{
  private _children: ITickable[] = [];

  constructor(options: Partial<TParentClockOptions> = {}) {
    super(options);
  }

  tick(t: number): void {
    super.tick(t);
    for (const child of this._children) {
      child.tick(this.t);
    }
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
}
