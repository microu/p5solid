import p5 from "p5";
import {
  IBox,
  IPoint,
  ITransformMatrix,
  PointSequence,
  applyMatrix,
  boxForPoints,
} from "@src/geom2d";

export type TLineData = {
  points: IPoint[];
  color: string;
  weight: number;
  box?: IBox;
  pointSeq?: PointSequence;
};

type TP5LinesDrawerOptions = {
  globalScale: boolean;
};
const TP5LinesDrawerOptions_default: TP5LinesDrawerOptions = {
  globalScale: true,
};

export class P5LinesDrawer {
  opt: TP5LinesDrawerOptions;
  box: IBox;
  matrix: ITransformMatrix = { ax: 1, ay: 0, ac: 0, bx: 0, by: 1, bc: 0 };

  constructor(
    readonly w: number,
    readonly h: number,
    readonly lines: TLineData[],
    options: Partial<TP5LinesDrawerOptions> = {}
  ) {
    this.opt = { ...TP5LinesDrawerOptions_default, ...options };
    this.box = this._updateBoundingBox();
  }

  _updateBoundingBox() {
    const boxPoints: IPoint[] = [];
    for (const line of this.lines) {
      const { min, max } = boxForPoints(line.points);
      line.box = { min, max };
      line.pointSeq = new PointSequence(line.points);
      boxPoints.push(min, max);
    }
    this.box = boxForPoints(boxPoints);
    this.matrix = this.matrixForBox(this.box);
    console.log("BOX/M:", this.box, this.matrix);
    for (const line of this.lines) {
      line.pointSeq!.matrix = this.opt.globalScale
        ? this.matrix
        : this.matrixForBox(line.box!);
    }

    return this.box;
  }

  draw(p: p5) {
    p.noFill();
    for (const line of this.lines) {
      p.stroke(line.color);
      p.strokeWeight(line.weight);

      for (const [pa, pb] of line.pointSeq!.segments()) {
        p.line(pa.x, pa.y, pb.x, pb.y);
      }
    }
  }

  scalePoint(p: IPoint, m: ITransformMatrix): IPoint {
    return applyMatrix(m, p);
  }

  matrixForBox(box: IBox): ITransformMatrix {
    return {
      ax: this.w / (box.max.x - box.min.x),
      ay: 0,
      ac: 0,
      bx: 0,
      by: -this.h / (box.max.y - box.min.y),
      bc: this.h,
    };
  }
}
