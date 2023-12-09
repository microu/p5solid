export interface ISegmentData {
  a: number;
  b: number;
  aClosed: boolean;
  bClosed: boolean;
}

export interface ISegment extends ISegmentData {
  contains(t: number): boolean;
}

export type TimeValueFunc = (t: number) => number;

export interface ITimeValueSegment extends ISegment {
  readonly v: TimeValueFunc;
}

export class SegmentBase implements ISegment {
  readonly a;
  readonly b;
  readonly aClosed;
  readonly bClosed;

  constructor(arg: Partial<ISegment>);
  constructor(a: number, b: number);
  constructor(arg: number | Partial<ISegment>, b?: number) {
    if (typeof arg == "number") {
      arg = { a: arg, b: b };
    }
    this.a = arg.a ?? -Infinity;
    this.aClosed = arg.aClosed ?? true;
    this.b = arg.b ?? Infinity;
    this.bClosed = arg.bClosed ?? false;
  }

  contains(t: number): boolean {
    if (this.a == Infinity || this.a == -Infinity || this.aClosed) {
      if (t < this.a) {
        return false;
      }
    } else {
      if (t <= this.a) {
        return false;
      }
    }
    if (this.b == Infinity || this.b == -Infinity || this.bClosed) {
      if (t > this.b) {
        return false;
      }
    } else {
      if (t >= this.b) {
        return false;
      }
    }
    return true;
  }
}
