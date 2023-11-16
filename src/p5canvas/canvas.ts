import p5 from "p5";

export interface ICanvasTime {
  t0: number; // start of drawing (ms) in p5 time
  t: number; // time of drawing: ms since t0
  dt: number; // time (ms) since last draw i
}

export interface ICanvasItem<TContext extends ICanvasTime = CanvasTimeBase> {
  draw(p: p5, ctx: TContext): string;
}

export class CanvasTimeBase implements ICanvasTime {
  t0: number;
  t: number;
  dt: number;
  constructor() {
    this.t0 = -1;
    this.t = 0;
    this.dt = 0;
  }

  draw(p: p5) {
    if (this.t0 < 0) {
      this.t0 = p.millis();
      this.t = 0;
      this.dt = 0;
    } else {
      const t = p.millis() - this.t0;
      this.dt = t - this.t;
      this.t = t;
    }
  }

  update(other: ICanvasTime) {
    this.t0 = other.t0;
    this.t = other.t;
    this.dt = other.dt;
  }
}

export type TItemParamTypes = number | string | object;
export type TItemParam<
  V extends TItemParamTypes = TItemParamTypes,
  TContext extends ICanvasTime = ICanvasTime
> = V | ((ctx: TContext) => V);

export function pv<
  V extends TItemParamTypes = TItemParamTypes,
  TContext extends ICanvasTime = ICanvasTime
>(ctx: TContext, v: TItemParam<V, TContext>): V {
  if (typeof v == "function") {
    return v(ctx);
  } else {
    return v;
  }
}

type ItemUpdaterFunc<
  TContext extends ICanvasTime = CanvasTimeBase,
  TItem extends ICanvasItem<TContext> = ICanvasItem<TContext>
> = (item: TItem, ctx: TContext) => string;

export class CanvasUpdatedItem<
  TContext extends ICanvasTime = CanvasTimeBase,
  TItem extends ICanvasItem<TContext> = ICanvasItem<TContext>
> implements ICanvasItem<TContext>
{
  constructor(
    private item: TItem,
    private updater: ItemUpdaterFunc<TContext, TItem>
  ) {}
  draw(p: p5, ctx: TContext): string {
    this.updater(this.item, ctx);
    return this.item.draw(p, ctx);
  }
}
