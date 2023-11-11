import p5 from "p5";

export interface TDrawItemContext<TParams = any> {
  t0: number; // start of drawing (ms) in p5 time
  t: number; // time of drawing: ms since t0
  dt: number; // time (ms) since last draw i
  params: TParams;
}

export type DrawItemFunc<TParams = any, TState = string> = (
  p: p5,
  context?: TDrawItemContext<TParams>
) => TState;

export interface ISketchItem {
  draw: DrawItemFunc;
}
