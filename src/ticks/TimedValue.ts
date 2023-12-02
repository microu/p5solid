import { IValueAt } from "./values";

interface ITimedValue<V> {
  v(t: number): V;
}

export class TimedValue<V> implements ITimedValue<V> {
  private keyPoints: IValueAt<V>[] = [];

  constructor(keyPoints: IValueAt<V>[] = []) {
    this.keyPoints = [...keyPoints];
    this.keyPoints.sort((kpa, kpb) => kpa.t - kpb.t);
    console.log(this.keyPoints);
  }

  v(t: number): V {
    const [a, b] = this.findInterval(t);
    console.log("[a, b]", a,b )
    if (a == undefined && b == undefined) {
      throw new Error(`No key point defined`);
    }

    if (a == undefined && b != undefined) {
      return b?.v;
    }
    if (b == undefined && a != undefined) {
      return a?.v;
    }

    return this._interpolate(a!, b!, t);
  }
  private _interpolate(a: IValueAt<V>, b: IValueAt<V>, t: number): V {
    if (typeof a.v == "number" && typeof b.v == "number") {
      return (a.v + ((t - a.t) / (b.t - a.t)) * (b.v - a.v)) as V;
    }

    throw new Error("Method currently implemented only for numbers");
  }

  private findInterval(
    t: number
  ): [kpa: IValueAt<V> | undefined, kpb: IValueAt<V> | undefined] {
    if (this.keyPoints.length == 0) return [undefined, undefined];

    if (t < this.keyPoints[0].t) {
      console.log("BEFORE")
      return [undefined, this.keyPoints[0]];
    }

    if (t >= this.keyPoints[this.keyPoints.length - 1].t) {
      console.log("AFTER")
      return [this.keyPoints[this.keyPoints.length - 1], undefined];
    }

    let i = 0;
    while (i < this.keyPoints.length && t >= this.keyPoints[i].t ) {
      i += 1;
    }
    console.log("INTERVAL", i, )
    return [this.keyPoints[i - 1], this.keyPoints[i]];
  }
}
