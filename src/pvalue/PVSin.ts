import { IKeyPoint, IPValue } from "./pvalue";

export type TPVSinOptions = {
  period: number;
  min: number;
  max: number;
  shift: number; // in period;
  keyPoint?: IKeyPoint<number>;
};

const default_PVSinOptions: TPVSinOptions = {
  period: 1,
  min: -1,
  max: 1,
  shift: 0,
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
    this.phase = this.options.shift * 2 * Math.PI;
  }

  v(t: number): number {
    return this.a + this.b * Math.sin(this.angularFrequency * t + this.phase);
  }
}
