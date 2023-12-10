export interface ISegmentData {
  a: number;
  b: number;
  aClosed: boolean;
  bClosed: boolean;
}

export interface ISegment extends ISegmentData {
  contains(t: number): boolean;
}


export function normalizeSegmentArg(arg: Partial<ISegmentData>): ISegmentData {

  const narg: ISegmentData = {...{a:-Infinity, b:Infinity, aClosed:true, bClosed:false}, ...arg}

  return narg;
}


export class SegmentBase implements ISegment {
  readonly a;
  readonly b;
  readonly aClosed;
  readonly bClosed;

  constructor(arg: Partial<ISegmentData>);
  constructor(a: number, b: number);
  constructor(arg: number | Partial<ISegmentData>, b?: number) {
    if (typeof arg == "number") {
      arg = { a: arg, b: b };
    }
    const narg = normalizeSegmentArg(arg) 
    this.a = narg.a;
    this.aClosed = narg.aClosed;
    this.b = narg.b
    this.bClosed = narg.bClosed;
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
