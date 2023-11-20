import { ITimelinePoint } from "./FixedTimeline";

export class TimeSequence {
  private points: ITimelinePoint[];

  constructor(points: ITimelinePoint[]) {
    this.points = [...points];
    this.points.sort((pa, pb) => pa.t - pb.t);
  }

  before(t:number): boolean {
    return false;
  }
  after(t:number): boolean {
    return false;
  }

  currentPoint(t:number):ITimelinePoint | undefined{
    return undefined;
  }
  
  currentState(t:number) {
    return 0;
  }

}
