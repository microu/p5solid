import { ClockBase, IClock, ITickable } from ".";

export interface ITargetValue<T> {
  t: number;
  v: T;
}

export class TickableValue<T = number>
  extends ClockBase
  implements ITickable, IClock
{
  private v: T;

  private a: ITargetValue<T> | undefined = undefined;
  private b: ITargetValue<T> | undefined = undefined;

  private targets: { t: number; v: T }[] = [];

  constructor(v0: T) {
    super();
    this.v = v0;
  }

  addTarget(target: ITargetValue<T>) {
    if (this.a != undefined && target.t <= this.t) {
      // ignore
      return;
    }
    this.targets.push(target);

    if (this.a == undefined) return;

    if (this.b == undefined) {
      this.a.t = this.t;
      this.b = target;
    } else if (target.t < this.b.t) {
      this.a = { v: this.v, t: this.t };
      this.b = target;
    }
  }

  tick(t: number): void {
    const prevt = this.t;
    super.tick(t);

    if (this.a == undefined) {
      this.a = { v: this.v, t };
      return;
    }

    this._updateTargets(prevt, t);

    if (this.b == undefined) {
      this.v = this.a.v;
      return;
    }

    const k = (t - this.a.t) / (this.b.t - this.a.t);
    console.log("K:", k);
    this.v = this.interpolate(this.a.v, this.b.v, k);
  }

  interpolate<T>(va: T, vb: T, k: number): T {
    if (typeof va == "number" && typeof vb == "number") {
      return (va + k * (vb - va)) as T;
    } else {
      return k < 0.5 ? va : vb;
    }
  }

  private _updateTargets(prevt: number, t: number) {
    if (this.b == undefined) {
      this.a = { t: prevt, v: this.v };
      this.b = this._findNearestTarget(t);
    } else if (t >= this.b.t) {
      this.a = this.b;
      this.b =  this._findNearestTarget(t)
    }
    console.log("B:", this.b);
  }

  private _findNearestTarget(t: number): ITargetValue<T> | undefined {
    let nearestTarget = undefined;
    for (let i = this.targets.length - 1; i >= 0; i -= 1) {
      const target = this.targets[i];
      if (target.t <= t) {
        this.targets.splice(i, 1);
      } else {
        if (nearestTarget == undefined) {
          nearestTarget = target;
        } else if (target.t < nearestTarget.t) {
          nearestTarget = target;
        }
      }
    }

    return nearestTarget;
  }

  value(): T {
    return this.v;
  }
}
