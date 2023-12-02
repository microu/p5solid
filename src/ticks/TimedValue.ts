import { IValueAt } from "./values";

export interface ITimedValue<V> {
  v(t: number): V;
}

export type ITimedValueInterpolator<V> = (va: V, vb: V, k: number) => V;

function defaultInterpolator<V>(va: V, vb: V, k: number): V {
  if (typeof va == "number" && typeof vb == "number") {
    return (va + k * (vb - va)) as V;
  }

  return k < 0.5 ? va : vb;
}

export class TimedValue<V> implements ITimedValue<V> {
  private keyPoints: IValueAt<V>[] = [];
  private interpolator: ITimedValueInterpolator<V>;

  constructor(
    keyPoints: IValueAt<V>[] = [],
    interpolator?: ITimedValueInterpolator<V>
  ) {
    this.keyPoints = [...keyPoints];
    this.keyPoints.sort((kpa, kpb) => kpa.t - kpb.t);
    this.interpolator = interpolator ?? defaultInterpolator;
  }

  v(t: number): V {
    const [a, b] = this.findInterval(t);
    console.log("[a, b]", a, b);
    if (a == undefined && b == undefined) {
      throw new Error(`No key point defined`);
    }

    if (a == undefined && b != undefined) {
      return b?.v;
    }
    if (b == undefined && a != undefined) {
      return a?.v;
    }

    return this._interpolate(a!, b!, t);
  }

  private _interpolate(a: IValueAt<V>, b: IValueAt<V>, t: number): V {
    const k = (t - a.t) / (b.t - a.t);
    return this.interpolator(a.v, b.v, k);
  }

  private findInterval(
    t: number
  ): [kpa: IValueAt<V> | undefined, kpb: IValueAt<V> | undefined] {
    if (this.keyPoints.length == 0) return [undefined, undefined];

    if (t < this.keyPoints[0].t) {
      console.log("BEFORE");
      return [undefined, this.keyPoints[0]];
    }

    if (t >= this.keyPoints[this.keyPoints.length - 1].t) {
      console.log("AFTER");
      return [this.keyPoints[this.keyPoints.length - 1], undefined];
    }

    let i = 0;
    while (i < this.keyPoints.length && t >= this.keyPoints[i].t) {
      i += 1;
    }
    console.log("INTERVAL", i);
    return [this.keyPoints[i - 1], this.keyPoints[i]];
  }
}
