import { IPoint } from "./point";

export class MaterialPoint implements IPoint {
  vx: number;
  vy: number;
  m: number;
  gravity: number;
  constructor(
    public x: number,
    public y: number,
    opt: {
      vx?: number;
      vy?: number;
      m?: number;
      gravity?: number;
    } = {}
  ) {
    this.vx = opt.vx ?? 0;
    this.vy = opt.vy ?? 0;
    this.m = opt.m ?? 1;
    this.gravity = opt.gravity ?? 0;
  }

  update(dt: number, fx = 0, fy = 0) {
    const ax = fx / this.m;
    const ay = fy / this.m + this.gravity;
    this.vx += ax * dt;
    this.vy += ay * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}
