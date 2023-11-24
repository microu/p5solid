import chroma from "chroma-js";
import { TimelinePointSequence } from "./TimelinePointSequence";

export type UpdatableValue = string | number;
export type UpdatableRecord = { [key: string]: UpdatableValue };
export type UpdatableRecordPoint = UpdatableRecord & {
  t: number;
  name: string;
};

export class TimelineDataUpdater {
  private data0: UpdatableRecord;
  private data: UpdatableRecord;

  constructor(
    private sequence: TimelinePointSequence<UpdatableRecordPoint>,
    data: UpdatableRecord
  ) {
    this.data0 = { ...data };
    this.data = data;
  }

  update(t: number): UpdatableRecord {
    const [aa, b, k] = this.sequence.interval(t);
    this.udpateWithPreviousPoints(aa);

    if (b != undefined) {
      for (const key of Object.keys(b)) {
        if (key in this.data) {
          const va = this.data[key];
          const vb = b[key];
          if (typeof va == "number" && typeof vb == "number") {
            this.data[key] = va + k * (vb - va);
          } else if (typeof va == "string" && typeof vb == "string") {
            this.data[key] = chroma.mix(va, vb, k).hex();
          }
        }
      }
    }
    return this.data;
  }

  udpateWithPreviousPoints(aa: UpdatableRecordPoint[]) {
    for (const k of Object.keys(this.data0)) {
      this.data[k] = this.data0[k];
    }

    for (const a of aa) {
      for (const k of Object.keys(a)) {
        if (k in this.data) this.data[k] = a[k];
      }
    }
  }

  done(t: number): boolean {
    const [_aa, b, _k] = this.sequence.interval(t);
    return b == undefined;
  }
}
