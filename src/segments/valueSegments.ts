import { ISegment, ISegmentData, SegmentBase } from "./segments";

export type ValueFunc<V = number> = (t: number) => V;
export interface IValueSegment<V = number> extends ISegmentData {
  readonly v: ValueFunc<V>;
}

export type InterpolatorFunc<V> = (va: V, vb: V, k: number) => V ;


function nearestInterpolator<V>(va: V, vb: V, k: number): V {
  return k < 0.5 ? va : vb;
}

function linearInterpolator(va: number, vb: number, k: number) {
  return va + k * (vb - va);
}

// function easingIdentity(k: number) {
//   return k;
// }

export class InterpolateSegment<V>
  extends SegmentBase
  implements IValueSegment<V>, ISegment
{
  private interpolator: InterpolatorFunc<V>;
  readonly va: V;
  readonly vb: V;

  constructor(arg: Partial<ISegmentData> & { va: V; vb: V }) {
    super(arg);
    this.va = arg.va;
    this.vb = arg.vb;
    if (typeof this.va == "number") {
      this.interpolator = linearInterpolator as unknown as InterpolatorFunc<V>;
    } else {
      this.interpolator = nearestInterpolator<V>;
    }
  }

  public v( t: number): V {
    const k = (t - this.a) / (this.b - this.a);
    return this.interpolator(this.va, this.vb, k);
  }

}

// export class ValueSegmentInterpolator
//   extends ValueSegmentBase
//   implements IValueSegment, ISegment
// {
//   constructor(arg: Omit<Partial<IValueSegment>, "v"> & { easing?: ValueFunc }) {
//     const narg = normalizeSegmentArg(arg);
//     let interpolator: undefined | ValueFunc;
//     if (!isInfinity(narg.a) && !isInfinity(narg.b)) {
//       interpolator = function (t: number) {
//         const k = (t - narg.a) / (narg.b - narg.a);
//         return;
//       };
//     }
//     super({ ...narg, v: interpolator });
//   }

//   _interpolator(): ValueFunc {
//     return (k: number) => k;
//   }
// }
