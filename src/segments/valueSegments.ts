import { ISegment, ISegmentData, SegmentBase } from "./segments";

export interface IValueSegmentData<V> extends ISegmentData {
  va: V;
  vb: V;
}
export type ValueFunc<V = number> = (t: number) => V;

export interface IValueSegment<V = number> extends IValueSegmentData<V>, ISegment{
  readonly v: ValueFunc<V>;
}

export type InterpolatorFunc<V> = (va: V, vb: V, k: number) => V;

function nearestInterpolator<V>(va: V, vb: V, k: number): V {
  return k < 0.5 ? va : vb;
}

function linearInterpolator(va: number, vb: number, k: number) {
  return va + k * (vb - va);
}

function easingIdentity(k: number) {
  return k;
}

export type TInterpolateSegmentOptions<V> = {
  easing: ValueFunc<number>;
  interpolator: InterpolatorFunc<V>;
};

export class InterpolateSegment<V>
  extends SegmentBase
  implements IValueSegment<V>, ISegment
{
  readonly va: V;
  readonly vb: V;
  private options: TInterpolateSegmentOptions<V>;

  constructor(
    arg: Partial<ISegmentData> & { va: V; vb: V },
    options: Partial<TInterpolateSegmentOptions<V>> = {}
  ) {
    super(arg);
    this.va = arg.va;
    this.vb = arg.vb;
    const interpolator =
      typeof this.va == "number"
        ? (linearInterpolator as unknown as InterpolatorFunc<V>)
        : nearestInterpolator<V>;

    this.options = { easing: easingIdentity, interpolator, ...options };
  }

  v(t: number): V {
    const k = (t - this.a) / (this.b - this.a);
    return this.options.interpolator(this.va, this.vb, this.options.easing(k));
  }
}

export class InterpolateNumberSegment extends InterpolateSegment<number> {}

export type TSegmentedValueOptions<V> = { before?: V; after?: V };

export class SegmentedValue<V> implements IValueSegment<V> {
  private globalSegment: SegmentBase;
  private vsegments: IValueSegment<V>[] = [];
  private before: V | undefined;
  private after: V | undefined;

  readonly va: V;
  readonly vb: V;

  constructor(
    vsegments: IValueSegment<V>[],
    options: TSegmentedValueOptions<V> = {}
  ) {
    if (vsegments.length == 0) {
      throw new Error(`At least one segment is needed`);
    }

    this.vsegments = [...vsegments];
    this.vsegments.sort((seg0, seg1) => seg0.a - seg1.a);
    this.globalSegment = new SegmentBase(
      this.vsegments[0].a,
      this.vsegments[this.vsegments.length - 1].b
    );
    this.va = this.vsegments[0].va;
    this.vb = this.vsegments[this.vsegments.length - 1].vb;
    this.before = options.before;
    this.after = options.after;
  }

  get a() {
    return this.globalSegment.a;
  }
  get b() {
    return this.globalSegment.b;
  }
  get aClosed() {
    return this.globalSegment.aClosed;
  }
  get bClosed() {
    return this.globalSegment.bClosed;
  }

  contains(t: number): boolean {
    return this.globalSegment.contains(t);
  }

  v(t: number): V {
    if (t >= this.globalSegment.b) {
      return this.after == undefined
        ? this.vsegments[this.vsegments.length - 1].v(t)
        : this.after;
    }
    if (t < this.globalSegment.a) {
      return this.before == undefined ? this.vsegments[0].v(t) : this.before;
    }

    for (let i = this.vsegments.length - 1; i >= 0; i -= 1) {
      const seg = this.vsegments[i];
      if (seg.contains(t)) {
        return seg.v(t);
      }
      if (t >= seg.b) {
        return seg.vb;
      }
    }
    throw new Error(`Should never happen: t=${t}`);
  }
}
