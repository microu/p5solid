export class NumberSegments {
  limits: number[];
  private _adpat: (i: number) => number;

  constructor(limits: number[], adapt?: (i: number) => number) {
    this.limits = [...limits].sort();
    this._adpat = adapt ?? ((i: number) => i);
  }

  segment(x: number): number {
    if (this.limits.length == 0) {
      return this._adpat(-1);
    }

    if (x < this.limits[0]) {
      return this._adpat(-1);
    }

    for (let i = 0; i < this.limits.length - 1; i += 1) {
      if (x >= this.limits[i] && x < this.limits[i + 1]) {
        return this._adpat(i);
      }
    }

    return this._adpat(this.limits.length - 1);
  }
}
