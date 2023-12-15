import chroma from "chroma-js";
import { IKeyPoint, IPValue } from "./pvalue";

export type PVInterpolator<T> = (va: T, vb: T, k: number) => T;
export type EasingFunc = (k: number) => number;

function defaultInterpolator<V>(va: V, vb: V, k: number): V {
  if (typeof va == "number" && typeof vb == "number") {
    // return (va + k * (vb - va)) as V;
    return linearInterpolator(va, vb, k) as V;
  }

  return k < 0.5 ? va : vb;
}

function linearInterpolator(va: number, vb: number, k: number) {
  return va + k * (vb - va);
}

function easingIdentity(k: number) {
  return k;
}

export type TPVInterpolateOptions<V> = {
  interpolator: PVInterpolator<V>;
  easing: EasingFunc;
  beforeMode: "extrapolate" | "constant";
  afterMode: "extrapolate" | "constant";
};

export class PVInterpolate<V> implements IPValue<V> {
  private keyPoints: IKeyPoint<V>[] = [];
  private interpolator: PVInterpolator<V>;
  private easing: EasingFunc;
  private beforeMode: "constant" | "extrapolate";
  private afterMode: "constant" | "extrapolate";

  constructor(
    keyPoints: IKeyPoint<V>[] = [],
    options: Partial<TPVInterpolateOptions<V>> = {}
  ) {
    this.keyPoints = [...keyPoints];
    this.keyPoints.sort((kpa, kpb) => kpa.t - kpb.t);
    this.interpolator = options.interpolator ?? defaultInterpolator;
    this.easing = options.easing ?? easingIdentity;
    this.beforeMode = options.beforeMode ?? "extrapolate";
    this.afterMode = options.afterMode ?? "extrapolate";
  }

  v(t: number): V {
    const [ia, ib] = this.findInterval(t);

    if (ia < 0 && ib < 0) {
      throw new Error(`No key point defined`);
    }

    if (ia < 0 && ib >= 0) {
      // before
      return this.beforeMode == "extrapolate"
        ? this._interpolate(this.keyPoints[ib], this.keyPoints[ib + 1], t)
        : this.keyPoints[ib].v;
    }

    if (ib < 0 && ia >= 0) {
      // after
      return this.afterMode == "extrapolate"
        ? this._interpolate(this.keyPoints[ia - 1], this.keyPoints[ia], t)
        : this.keyPoints[ia].v;
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

  // insertKeyPoint(
  //   kp: number | Omit<IKeyPoint<V>, "v">,
  //   easingBefore?: EasingFunc
  // ) {
  //   if (typeof kp == "number") {
  //     kp = { t: kp };
  //   }

  //   if (easingBefore != undefined) {
  //     const [ia, _ib] = this.findInterval(kp.t);
  //     if (ia >= 0) {
  //       this.keyPoints[ia].easing = easingBefore;
  //     }
  //   }
  //   const v = this.v(kp.t);
  //   this.addKeyPoint({ ...kp, v });
  // }

  private _interpolate(a: IKeyPoint<V>, b: IKeyPoint<V>, t: number): V {
    // const easing = a.easing ?? this.easing;
    const k = (t - a.t) / (b.t - a.t);
    return this.interpolator(a.v, b.v, this.easing(k));
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

export class PVInterpolateNumber extends PVInterpolate<number> {
  constructor(
    keyPoints: IKeyPoint<number>[] = [],
    options: Partial<TPVInterpolateOptions<number>> = {}
  ) {
    const interpolator = options.interpolator ?? linearInterpolator;
    super(keyPoints, { ...options, interpolator });
  }
}

function chromaColorInterpolator(va: string, vb: string, k: number) {
  return chroma.mix(va, vb, k).hex();
}

export class PVInterpolateColor extends PVInterpolate<string> {
  constructor(
    keyPoints: IKeyPoint<string>[] = [],
    options: Partial<TPVInterpolateOptions<string>> = {}
  ) {
    const interpolator = options.interpolator ?? chromaColorInterpolator;
    super(keyPoints, { ...options, interpolator });
  }
}

export function sinInOutInterpolator(a: number, b: number, k: number): number {
  const theta = -Math.PI / 2 + k * Math.PI;
  const kk = (1 + Math.sin(theta)) / 2;
  return a + kk * (b - a);
}
