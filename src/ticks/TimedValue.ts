import { IValueAt } from "./values";

export interface ITimedValue<V> {
  v(t: number): V;
}

export type ITimedValueInterpolator<V> = (va: V, vb: V, k: number) => V;

export interface IKeyPoint<V> extends IValueAt<V> {
  interpolator?: ITimedValueInterpolator<V>;
}

function defaultInterpolator<V>(va: V, vb: V, k: number): V {
  if (typeof va == "number" && typeof vb == "number") {
    return (va + k * (vb - va)) as V;
  }

  return k < 0.5 ? va : vb;
}

export class TimedValue<V> implements ITimedValue<V> {
  private keyPoints: IKeyPoint<V>[] = [];
  private interpolator: ITimedValueInterpolator<V>;

  constructor(
    keyPoints: IKeyPoint<V>[] = [],
    interpolator?: ITimedValueInterpolator<V>
  ) {
    this.keyPoints = [...keyPoints];
    this.keyPoints.sort((kpa, kpb) => kpa.t - kpb.t);
    this.interpolator = interpolator ?? defaultInterpolator;
  }

  v(t: number): V {
    const [ia, ib] = this.findInterval(t);

    if (ia < 0 && ib < 0) {
      throw new Error(`No key point defined`);
    }

    if (ia < 0 && ib >= 0) {
      return this.keyPoints[ib].v;
    }
    if (ib < 0 && ia >= 0) {
      return this.keyPoints[ia].v;
    }

    return this._interpolate(this.keyPoints[ia], this.keyPoints[ib], t);
  }

  addKeyPoint(kp: IKeyPoint<V>) {
    const [ia, ib] = this.findInterval(kp.t);
    if (ib < 0) {
      kp;
      this.keyPoints.push(kp);
      return;
    }

    if (ia < 0) {
      this.keyPoints.splice(0, 0, kp);
      return;
    }

    this.keyPoints.splice(ib, 0, kp);
  }

  insertKeyPoint(
    kp: Omit<IKeyPoint<V>, "v">,
    interpolatorBefore?: ITimedValueInterpolator<V>
  ) {
    if (interpolatorBefore != undefined) {
      const [ia, _ib] = this.findInterval(kp.t);
      if (ia >= 0) {
        this.keyPoints[ia].interpolator = interpolatorBefore;
      }
    }
    const v = this.v(kp.t);
    this.addKeyPoint({ ...kp, v });
  }

  private _interpolate(a: IKeyPoint<V>, b: IKeyPoint<V>, t: number): V {
    const interpolator = a.interpolator ?? this.interpolator;
    const k = (t - a.t) / (b.t - a.t);
    return interpolator(a.v, b.v, k);
  }

  private findInterval(t: number): [ia: number, ib: number] {
    if (this.keyPoints.length == 0) return [-1, -1];

    if (t < this.keyPoints[0].t) {
      return [-1, 0];
    }

    if (t >= this.keyPoints[this.keyPoints.length - 1].t) {
      return [this.keyPoints.length - 1, -1];
    }

    let i = 0;
    while (i < this.keyPoints.length && t >= this.keyPoints[i].t) {
      i += 1;
    }
    return [i - 1, i];
  }
}

export class TimedNumber extends TimedValue<number> {}

export function sinInOutInterpolator(a: number, b: number, k: number): number {
  const theta = -Math.PI / 2 + k * Math.PI;
  const kk = (1 + Math.sin(theta)) / 2;
  return a + kk * (b - a);
}
