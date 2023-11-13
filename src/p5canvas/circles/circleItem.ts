import p5 from "p5";
import {
  CanvasTimeBase,
  ICanvasItem,
  ICanvasTime,
  TItemParam,
  pv,
} from "../canvas";

export class CircleItem implements ICanvasItem<ICanvasTime, string> {
  constructor(
    private params: {
      color: TItemParam<string>;
      x: TItemParam<number>;
      y: TItemParam<number>;
      d: TItemParam<number>;
      state: TItemParam<string>;
    }
  ) {}

  draw(p: p5, ctx: CanvasTimeBase): string {
    const x = pv(ctx, this.params.x);
    const y = pv(ctx, this.params.y);
    const d = pv(ctx, this.params.d);
    const color = pv(ctx, this.params.color);
    const state = pv(ctx, this.params.state);
    p.noStroke();
    p.fill(color);
    p.circle(x, y, d);
    return state;
  }
}
