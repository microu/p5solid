import { IPValue } from "./pvalue";

type PVSegment<T> = {
  a?: number;
  b?: number;
  pv: IPValue<T>;
};

function segmentContains<T>(seg: PVSegment<T>, t: number): boolean {
  if (seg.a != undefined) {
    if (seg.b != undefined) {
      return seg.a <= t && t < seg.b;
    } else {
      return seg.a <= t;
    }
  } else {
    if (seg.b != undefined) {
      return t < seg.b;
    } else {
      return true;
    }
  }
}

export class PVSegments<T = any> implements IPValue<T> {
  private segments: PVSegment<T>[];
  constructor(segments: PVSegment<T>[]) {
    this.segments = [...segments];
  }

  v(t: number): T {
    for (const seg of this.segments) {
      if (segmentContains(seg, t)) {
        return seg.pv.v(t);
      }
    }
    return this.segments[this.segments.length - 1].pv.v(t);
  }
}
