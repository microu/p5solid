import { IKeyPoint, IPValue } from "./pvalue";

export type TPVSinOptions = {
  period: number;
  min: number;
  max: number;
  periodShift: number; // in period;
  keyPoint?: IKeyPoint<number>;
};

const default_PVSinOptions: TPVSinOptions = {
  period: 1,
  min: -1,
  max: 1,
  periodShift: 0,
};

export class PVSin implements IPValue<number> {
  private options: TPVSinOptions;
  private amplitude = 0;
  private a = 0;
  private b = 0;
  private angularFrequency = 0;
  private phase = 0;
  constructor(opt: Partial<TPVSinOptions> = {}) {
    this.options = { ...default_PVSinOptions, ...opt };
    this.amplitude = this.options.max - this.options.min;
    this.b = this.amplitude / 2;
    this.a = this.options.min + this.b;
    this.angularFrequency = (2 * Math.PI) / this.options.period;
    this.phase = this.options.periodShift * -2 * Math.PI;

    if (this.options.keyPoint != undefined) {
      const kp = this.options.keyPoint;
      if (kp.v < this.options.min || kp.v > this.options.max) {
        throw new Error(`Keypoint value out of range: ${kp}`);
      }
      // v = a + b * sin
      // sin = (v -a) / b
      // sin = arcsin( (v -a)/b )
      // afq * t + phase = arcsin( (v -a)/b )
      // phase = arcsin( (v -a)/b ) - afq * t
      this.phase =
        Math.asin((kp.v - this.a) / this.b) - this.angularFrequency * kp.t;
    }
  }

  v(t: number): number {
    return this.a + this.b * Math.sin(this.angularFrequency * t + this.phase);
  }
}
