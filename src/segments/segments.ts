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
  const narg = {
    ...{ a: 0, b: 1, aClosed: true, bClosed: false },
    ...arg,
  };

  if (!Number.isFinite(narg.a)) {
    throw new Error(`a is not finite: ${narg.a}`);
  }

  if (!Number.isFinite(narg.b)) {
    throw new Error(`b is not finite: ${narg.b}`);
  }

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
    const narg = normalizeSegmentArg(arg);
    this.a = narg.a;
    this.aClosed = narg.aClosed;
    this.b = narg.b;
    this.bClosed = narg.bClosed;
  }

  contains(t: number): boolean {
    return (
      (this.aClosed ? t >= this.a : t > this.a) &&
      (this.bClosed ? t <= this.b : t < this.b)
    );
  }
}
