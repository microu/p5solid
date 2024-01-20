import p5 from "p5";
import {
  IBox,
  IPoint,
  ITransformMatrix,
  PointSequence,
  applyMatrix,
  boxMapMatrix,
  minMaxBoxForPoints,
} from "@src/geom2d";

export type TLineData = {
  points: IPoint[];
  color: string;
  weight: number;
  box?: IBox;
  pointSeq?: PointSequence;
};

export type TP5MultiLineDrawerOptions = {
  globalScale: boolean;
  margin: number;
  origin: "bl" | "br" | "tl" | "tr";
  swapXY: boolean;
};

const TP5MultiLineDrawerOptions_default: TP5MultiLineDrawerOptions = {
  globalScale: true,
  margin: 0,
  origin: "bl",
  swapXY: false,
};

export class P5MultiLineDrawer {
  opt: TP5MultiLineDrawerOptions;
  box: IBox;
  matrix: ITransformMatrix = { ax: 1, bx: 0, cx: 0, ay: 0, by: 1, cy: 0 };

  constructor(
    readonly w: number,
    readonly h: number,
    readonly lines: TLineData[],
    options: Partial<TP5MultiLineDrawerOptions> = {}
  ) {
    this.opt = { ...TP5MultiLineDrawerOptions_default, ...options };
    this.box = this._updateBoundingBox();
  }

  _updateBoundingBox() {
    const boxPoints: IPoint[] = [];
    for (const line of this.lines) {
      const { a: min, b: max } = minMaxBoxForPoints(line.points);
      line.box = { a: min, b: max };
      line.pointSeq = new PointSequence(line.points);
      boxPoints.push(min, max);
    }
    this.box = minMaxBoxForPoints(boxPoints);
    this.matrix = this.matrixForBox(this.box);
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
    const margin = this.opt.margin;

    let drawBox: IBox;
    if (this.opt.origin == "tl") {
      drawBox = {
        a: { x: margin, y: margin },
        b: { x: this.w - margin, y: this.h - margin },
      };
    } else if (this.opt.origin == "bl") {
      drawBox = {
        a: { x: margin, y: this.h - margin },
        b: { x: this.w - margin, y: margin },
      };
    } else if (this.opt.origin == "br") {
      drawBox = {
        a: { x: this.w - margin, y: this.h - margin },
        b: { x: margin, y: margin },
      };
    } else {
      // this.opt.origin == "tr"
      drawBox = {
        a: { x: this.w - margin, y: margin },
        b: { x: margin, y: this.h - margin },
      };
    }

    const m = boxMapMatrix(box, drawBox!, this.opt.swapXY);

    return m;

    return {
      ax: this.w / (box.b.x - box.a.x),
      bx: 0,
      cx: 0,
      ay: 0,
      by: -this.h / (box.b.y - box.a.y),
      cy: this.h,
    };
  }
}
