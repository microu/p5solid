import { Heap } from "heap-js";

export class EventScheduler<TEvent extends { t: number }> {
  private heap = new Heap<TEvent>((a, b) => a.t - b.t);
  readonly t0: number;
  private _clock: number;

  constructor(t0: number = 0) {
    this.t0 = Math.floor(t0);
    this._clock = this.t0 - 1;
  }

  add(e: TEvent) {
    this.heap.push(e);
  }

  moveClock(clockValue: number): TEvent[] {
    if (clockValue <= this._clock) {
      throw new Error(`Clock value can only be increased.`);
    }
    const r = [] as TEvent[];
    let nextEvent = this.heap.peek();
    while (nextEvent && nextEvent.t <= clockValue) {
      const e = this.heap.pop();
      if (e) {
        r.push(e);
      }
      nextEvent = this.heap.peek();
    }
    this._clock = clockValue;
    return r;
  }

  get clock() {
    return this._clock;
  }

  get length() {
    return this.heap.length;
  }
}
