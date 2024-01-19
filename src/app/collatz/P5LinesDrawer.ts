import p5 from "p5";
import { IBox, IPoint, boxForPoints } from "@src/geom2d";

type TLineData = {
  points: IPoint[];
  color: string;
  weight: number;
};

type TP5LinesDrawerOptions = {};

export class P5LinesDrawer {
  opt: TP5LinesDrawerOptions;
  box: IBox;
  xscale = 1;
  yscale = 1;

  constructor(
    readonly w: number,
    readonly h: number,
    readonly lines: TLineData[],
    options: TP5LinesDrawerOptions
  ) {
    this.opt = { ...options };
    this.box = this._updateBoundingBox();
  }

  _updateBoundingBox() {
    const boxPoints: IPoint[] = [];
    for (const line of this.lines) {
      const { min, max } = boxForPoints(line.points);
      boxPoints.push(min, max);
    }
    this.box = boxForPoints(boxPoints);
    this.xscale = this.w / (this.box.max.x - this.box.min.x);
    this.yscale = this.h / (this.box.max.y - this.box.min.y);
    return this.box;
  }

  draw(p: p5) {
    p.noFill();
    for (const line of this.lines) {
      p.stroke(line.color);
      p.strokeWeight(line.weight);
      for (let i = 0; i < line.points.length - 1; i += 1) {
        const a = line.points[i];
        const b = line.points[i + 1];
        const xa = (a.x - this.box.min.x) * this.xscale;
        const ya = (a.y - this.box.min.y) * this.yscale;
        const xb = (b.x - this.box.min.x) * this.xscale;
        const yb = (b.y - this.box.min.y) * this.yscale;
        p.line(xa, ya, xb, yb);
      }
    }
  }
}
