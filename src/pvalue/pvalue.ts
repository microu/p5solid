export interface IPValue<T> {
  v(t: number): T;
}

export interface IKeyPoint<T> {
  t: number;
  v: T;
}

export type PValueFunc<V> = (p: number) => V;
