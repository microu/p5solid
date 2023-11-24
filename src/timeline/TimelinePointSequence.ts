import { ITimelinePoint, compareTimelinePoints } from "./FixedTimeline";

export class TimelinePointSequence<
  TPoint extends ITimelinePoint = ITimelinePoint
> {
  points: TPoint[];

  constructor(points: TPoint[]) {
    this.points = [...points];
    this.points.sort(compareTimelinePoints);
    for (let i = 0; i + 1 < this.points.length; i += 1) {
      if (this.points[i].t == this.points[i + 1].t) {
        throw new Error("Times must be stricly increasing");
      }
    }
  }

  interval(
    t: number
  ): [p0: TPoint [], p1: TPoint | undefined, k: number] {
    if (this.points.length == 0) {
      return [[], undefined, 0];
    }
    let i = 0;
    while (i < this.points.length && t >= this.points[i].t) i += 1;
    // i>= this.points.length || t < this.points[i].t
    if (i == 0) {
      return [ [], this.points[0], 0];
    } else if (i < this.points.length) {
      return [
        this.points.slice(0,i),
        this.points[i],
        (t - this.points[i - 1].t) / (this.points[i].t - this.points[i - 1].t),
      ];
    } else {
      return [this.points, undefined, 0];
    }
  }
}
