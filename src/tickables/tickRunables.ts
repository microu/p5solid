export interface ITickRunnable<C = any> {
  tickRun(t: number, dt: number, ctx: C): string;
}
