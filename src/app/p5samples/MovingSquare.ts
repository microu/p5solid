import {
  IPValue,
  PVConstant,
  PVInterpolateColor,
  PVInterpolateNumber,
} from "@src/pvalue";
import { PVSegments } from "@src/pvalue/PVSegments";
import { PVSin } from "@src/pvalue/PVSin";
import { EngineActionFunc, IEngineTickable } from "@src/tickables";
import p5 from "p5";

export interface IMovingSquareData {
  cx: number;
  cy: number;
  r: number;
  rotate: number;
  color: string;
}

type TPVMovingSquareData = {
  [Properties in keyof IMovingSquareData]?: IPValue<
    IMovingSquareData[Properties]
  >;
};

export class MovingSquare<TContext extends { p: p5 }>
  implements IEngineTickable<TContext>, IMovingSquareData
{
  t = -1;
  cx: number;
  cy: number;
  r: number;
  rotate: number;
  color: string;

  t0: number;

  pv: TPVMovingSquareData = {};

  eol: number | undefined;
  eolAction: undefined | EngineActionFunc<TContext>;

  constructor(t0: number, data: IMovingSquareData) {
    this.t0 = t0;
    this.t = t0;

    this.cx = data.cx;
    this.cy = data.cy;
    this.r = data.r;
    this.rotate = data.rotate;
    this.color = data.color;

    this.pv.cx = new PVConstant(this.cx);
    this.pv.cy = new PVConstant(this.cy);
    this.pv.r = new PVConstant(this.r);
    this.pv.rotate = this.pvStableMove("rotate", t0, this.rotate);
    this.pv.color = new PVConstant(this.color);

  }

  pvStableMove<T>(name: keyof IMovingSquareData, t: number, v0: T): IPValue<T> {
    if (name == "cx") {
      const cx0 = v0 as number;
      return new PVSin({
        min: cx0 - 30,
        max: cx0 + 30,
        keyPoint: { t: t, v: cx0 },
      }) as unknown as IPValue<T>;
    } else if (name == "rotate") {
      const rotate0 = v0 as number;

      return new PVSin({
        min: rotate0 - Math.PI / 2,
        max: rotate0 + Math.PI / 2,
        period: 5 + Math.random() * 5,
        keyPoint: { t: t, v: rotate0 },
      }) as unknown as IPValue<T>;
    }
    return new PVConstant(v0);
  }

  ctick(
    t: number,
    _dt: number,
    ctx: TContext
  ): string | undefined | EngineActionFunc<TContext> {
    this.t = t;

    for (const [name, pv] of Object.entries(this.pv)) {
      // @ts-ignore
      this[name] = pv.v(t);
    }

    this.draw(ctx.p);

    if (this.eol != undefined && t > this.eol) {
      if (this.eolAction) {
        return this.eolAction;
      } else {
        return "!done";
      }
    }
  }

  draw(p: p5) {
    p.noStroke();
    p.fill(this.color);
    p.beginShape();
    for (let i = 0; i < 4; i += 1) {
      const theta = this.rotate + i * (Math.PI / 2);
      p.vertex(
        this.cx + this.r * Math.sin(theta),
        this.cy + this.r * Math.cos(theta)
      );
    }
    p.endShape(p.CLOSE);
  }

  moveTo(d: number, data: Partial<IMovingSquareData>) {
    const t0 = this.t;
    const t1 = this.t + d;
    if ("cx" in data) {
      const v0 = this.cx;
      const v1 = data.cx!;
      this.pv.cx = new PVSegments([
        {
          b: t1,
          pv: new PVInterpolateNumber([
            { t: t0, v: v0 },
            { t: t1, v: v1 },
          ]),
        },
        {
          pv: this.pvStableMove("cx", t1, v1),
        },
      ]);
    }
  }

  triggerEOL(t: number, data: IMovingSquareData) {
    this.pv.color = new PVInterpolateColor(
      [
        { t: this.t, v: this.color },
        { t: t, v: data.color },
      ],
      { afterMode: "constant" }
    );
    this.pv.r = new PVInterpolateNumber(
      [
        { t: this.t, v: this.r },
        { t: t, v: data.r },
      ],
      { afterMode: "constant" }
    );

    this.eol = t;
  }
}
