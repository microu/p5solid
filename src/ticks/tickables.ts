export interface ITickable {
  tick(t: number): void;
}

export interface IClock {
  readonly started: boolean;
  readonly t: number;
}

export interface IParentClock extends IClock {
  addChild(child: ITickable): void;
  removeChild(child: ITickable): void;
}

export class ClockBase implements IClock, ITickable {
  private _started: boolean = false;
  private _t: number = 0;
  tick(t: number): void {
    if (this._started && t <= this._t) {
      throw new Error(
        `Tick times must be stricly increasing but ${t} <=  ${this._t}`
      );
    }
    this._started = true;
    this._t = t;
  }

  get t() {
    return this._t;
  }

  get started() {
    return this._started;
  }
}

type TParentClockOptions = {
  t0?: number;
  scale: number;
};

const DEFAULT_TParentClockOptions: TParentClockOptions = {
  t0: undefined,
  scale: 1,
};

export class ParentClock implements ITickable, IParentClock {
  private _t: number;
  private _state: "" | "initialized" | "started" = "";
  private _parent_t = 0;
  private t0: number = 0;
  private _children: ITickable[] = [];

  options: { t0?: number | undefined; scale: number };

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
      this.t0 = this.options.t0 ?? t;
      this._state = "initialized";
    }

    if (this.started && t <= this._parent_t) {
      throw new Error(
        `Tick times must be stricly increasing : ${t} <=  ${this._parent_t}`
      );
    }

    if (t >= this.t0) {
      const ct = (t - this.t0) * this.options.scale;
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
}
