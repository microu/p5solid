import { ISegment, ISegmentData, SegmentBase } from "./segments";

export interface IValueSegmentData extends ISegmentData {
  va: number;
  vb: number;
}

export type ValueFunc = (t: number) => number;

export interface IValueSegment extends IValueSegmentData {
  readonly v: ValueFunc;
}

function isInfinity(x: number) {
  return x == Infinity || x == -Infinity;
}

export class ValueSegmentBase
  extends SegmentBase
  implements IValueSegment, ISegment
{
  readonly v: ValueFunc;
  readonly va: number;
  readonly vb: number;
  private deltav: number;

  constructor(arg: Partial<IValueSegment>) {
    super(arg);
    if (arg.v != undefined) {
      this.v = arg.v;
    } else {
      if (isInfinity(this.a)) {
        if (isInfinity(this.b)) {
          this.v = (_: number) => 0;
        } else {
          this.v = (_: number) => this.vb;
        }
      } else {
        if (isInfinity(this.b)) {
          this.v = (_: number) => this.va;
        } else {
          console.log("LINEAR");
          this.v = (t: number) =>
            this.va + ((t - this.a) / (this.b - this.a)) * this.deltav;
        }
      }
    }
    this.va = arg.va ?? 0;
    this.vb = arg.vb ?? 1;
    this.deltav = this.vb - this.va;
  }

  protected setValueFunc(v:ValueFunc) {
    this.v = v;
  }
}

export class ValueSegmentInterpolator
  extends ValueSegmentBase
  implements IValueSegment, ISegment
{
  constructor(arg: Omit<Partial<IValueSegment>, "v"> & { easing?: ValueFunc }) {
    super({ ...arg});
    this.v = this._interpolator

  }

  _interpolator(): ValueFunc {
    return (k: number) => k;
  }
}
