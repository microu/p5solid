export interface ITickable {
  tick(t: number, dt: number): void;
}

export interface IClock {
  started: boolean;
  t: number;
  dt: number;
}

type TParentClockOptions = {
  t0?: number;
  scale: number;
};

const DEFAULT_TParentClockOptions: TParentClockOptions = {
  t0: undefined,
  scale: 1,
};

export class ParentClock implements ITickable, IClock {
  private _t: number;
  private _dt: number;
  private _state: "" | "initialized" | "started" = "";
  private _parent_t = 0;
  private t0: number = 0;
  options: { t0?: number | undefined; scale: number };

  constructor(options: Partial<TParentClockOptions> = {}) {
    this.options = { ...DEFAULT_TParentClockOptions, ...options };
    this._t = 0;
    this._dt = -1;
  }

  tick(t: number, dt: number): void {
      if ( this._state == "") {
        this.t0 = this.options.t0 ?? t
        this._state = "initialized"
      }

      if (this.started && t <= this._parent_t) {
        throw new Error(
          `Tick times must be stricly increasing : ${t} <=  ${this._parent_t}`
        );
      }

      if (t >= this.t0) {      
        const ct = (t - this.t0) / this.options.scale;
        const dct = ct- this._t;
        this._update(t, ct, dct)
      }
  }

  private _update(parent_t: number, t: number, dt: number) {
    this._state = "started";
    this._parent_t = parent_t;
    this._t = t;
    this._dt = dt;
  }

  get t() {
    return this._t;
  }
  get dt() {
    return this._dt;
  }
  get started() {
    return this._state == "started";
  }
}
