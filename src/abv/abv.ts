export type TimeValueFunc = (t: number) => number;

export interface ITimeValueSegment {
  readonly a: number;
  readonly b: number;
  readonly v: TimeValueFunc;
}

export class TimeValueSegmentBase implements ITimeValueSegment{
  a!: number;
  b!: number;
  v!: TimeValueFunc;
}

