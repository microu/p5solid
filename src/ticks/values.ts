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
    if (target.t > this.t) {
      this.targets.push(target);
      this.b = undefined;
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
    if (this.b != undefined && t <= this.b.t) {
      return;
    }

    this.a = { t: prevt, v: this.v };

    this.b = undefined;
    for (let i = this.targets.length - 1; i >= 0; i -= 1) {
      const target = this.targets[i];
      if (target.t <= t) {
        this.targets.splice(i, 1);
      } else {
        if (this.b == undefined) {
          this.b = target;
        } else if (target.t < this.b.t) {
          this.b = target;
        }
      }
    }
    console.log("B:", this.b);
  }

  value(): T {
    return this.v;
  }
}
