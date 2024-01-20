import {
  IBox,
  PointSequence,
  boxMapMatrix,
  minMaxBoxForPoints,
} from "@src/geom2d";
import p5 from "p5";

export type TPointMapping = {
  box: IBox;
  origin: "bl" | "br" | "tl" | "tr";
  swapXY: boolean;
};
export type TPointMappingArg = {
  box: IBox;
  swapXY?: boolean;
};

export type TDrawingParams = {
  color: string;
  weight: number;
  opacity: number;
};
const TDrawingParams_default: TDrawingParams = {
  color: "#000000",
  weight: 2,
  opacity: 1,
};

export class P5LineDrawer {
  private pointMapping: TPointMapping;
  private drawingParams: TDrawingParams;
  constructor(
    readonly line: PointSequence,
    pointMapping: TPointMappingArg,
    drawingParams: Partial<TDrawingParams>
  ) {
    this.pointMapping = { origin: "bl", swapXY: false, ...pointMapping };
    this.drawingParams = { ...TDrawingParams_default, ...drawingParams };

    const valueBox = minMaxBoxForPoints([...line]);

    this.line.matrix = boxMapMatrix(
      valueBox,
      this.pointMapping.box,
      this.pointMapping.swapXY
    );
  }

  draw(p: p5) {
    p.noFill();
    p.stroke(this.drawingParams.color);
    p.strokeWeight(this.drawingParams.weight);
    for (const [pa, pb] of this.line.segments()) {
      p.line(pa.x, pa.y, pb.x, pb.y);
    }
  }
}
