import { ITickable, ParentClock } from ".";

export class TickableValue<T = number>
  extends ParentClock
  implements ITickable
{
  private v: T;

  private aDefined = false;
  private va: T;
  private ta: number;

  private targets: { t: number; v: T }[] = [];
  private nextTarget: { t: number; v: T } | undefined = undefined;

  constructor(private v0: T) {
    super();
    this.v = v0;
    this.va = v0;
    this.ta = 0;
  }

  addTarget(t: number, v: T) {
    if (t > this.t) {
      this.targets.push({ t, v });
      this.nextTarget = undefined;
    }
  }

  tick(t: number, _dt: number): void {
    if (!this.aDefined) {
      this.va = this.v0;
      this.ta = t;
      this.v = this.va;
      return;
    }
    this._updateNextTarget(t);
    if (this.nextTarget == undefined) {
      return;
    }

    const k = (t- this.ta) / (this.nextTarget.t - this.ta);
    this.v  =  this.interpolate(this.va, this.nextTarget.v, k) 
  }

  interpolate<T>(va: T, vb: T, k: number): T {
    if (typeof va == "number" && typeof vb == "number") {
      return va + k *(vb-va) as T;
    } else {
      return va;
    }

  }

  private _updateNextTarget(t: number) {
    if (this.nextTarget != undefined && t <= this.nextTarget.t) {
      return;
    }
    this.ta = t;
    this.va = this.v;

    this.nextTarget = undefined;
    for (let i = this.targets.length - 1; i >= 0; i -= 1) {
      const target = this.targets[i];
      if (target.t <= t) {
        this.targets.splice(i, 1);
      } else {
        if (this.nextTarget == undefined) {
          this.nextTarget = target;
        } else if (target.t < this.nextTarget.t) {
          this.nextTarget = target;
        }
      }
    }

  }

  value(): T {
    return this.v;
  }
}
