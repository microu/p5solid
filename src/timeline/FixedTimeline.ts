export interface ITimelinePoint {
  t: number;
  name: string;
}

export interface ITimelineFrame extends ITimelinePoint {
  dur: number;
}

export type ITimelineItem = ITimelinePoint | ITimelineFrame;

export type TTimeLineEvent = {
  t: number;
  type: "frameBegin" | "frameEnd" | "point";
  item: ITimelineItem;
};

export class FixedTimeline {
  private events: TTimeLineEvent[] = [];
  private nextEvent = 0;
  private t = -1;
  private _activeFrames: ITimelineFrame[] = [];

  constructor(items: ITimelineItem[], _options?: {}) {
    for (const item of items) {
      if ("dur" in item) {
        if (item.t < 0) {
          throw new Error(`Negative time not allowed: ${item.t}`);
        }
        if (item.dur <= 0) {
          throw new Error(`Negative duration not allowed ${item.dur}`);
        }
        this.events.push({ t: item.t, item: item, type: "frameBegin" });
        this.events.push({
          t: item.t + item.dur,
          item: item,
          type: "frameEnd",
        });
      } else {
        this.events.push({ t: item.t, item: item, type: "point" });
      }
    }
    this.events.sort((a, b) => a.t - b.t);
  }

  run(t1: number) {
    if (t1 <= this.t) {
      throw new Error("Time of run calls must be increasing");
    }
    this.t = t1;
    const r: TTimeLineEvent[] = [];
    while (
      this.nextEvent < this.events.length &&
      this.events[this.nextEvent].t <= t1
    ) {
      const e = this.events[this.nextEvent];
      if (e.type == "frameBegin") {
        this._activeFrames.push(e.item as ITimelineFrame);
      } else if (e.type == "frameEnd") {
        const i = this._activeFrames.indexOf(e.item as ITimelineFrame);
        if (i >= 0) {
          this._activeFrames.splice(i, 1);
        }
      }
      r.push(e);
      this.nextEvent++;
    }
    return r;
  }

  get activeFrames() {
    return this._activeFrames;
  }

  done() {
    return this.nextEvent >= this.events.length;
  }
}
