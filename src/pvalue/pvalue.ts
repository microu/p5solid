export interface IPValue<T> {
  v(t: number): T;
}

export interface IKeyPoint<T> {
  t: number;
  v: T;
}

export type PValueFunc<V> = (p: number) => V;

export class PVConstant<V> implements IPValue<V> {
  private _v: V;
  constructor(v: V) {
    this._v = v;
  }
  v(_t: number): V {
    return this._v;
  }
}
