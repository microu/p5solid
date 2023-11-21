import p5 from "p5";
import { IP5Item, IP5TimeContext, P5TimeContext } from "./P5Items";

export type P5DrawFunc<TContext extends IP5TimeContext = P5TimeContext> = (
  p: p5,
  ctx: TContext
) => string;

export class P5Drawer<TContext extends IP5TimeContext = P5TimeContext>
  implements IP5Item<TContext>
{
  constructor(private drawer: P5DrawFunc<TContext>) {}
  draw(p: p5, ctx: TContext): string {
    return this.drawer(p, ctx);
  }
}

export type P5DrawDataFunc<
  TContext extends IP5TimeContext = P5TimeContext,
  TData = any
> = (p: p5, ctx: TContext, data: TData) => string;

export class P5DataDrawer<
    TData = any,
    TContext extends IP5TimeContext = IP5TimeContext
  >
  extends P5Drawer<TContext>
  implements IP5Item<TContext>
{
  constructor(
    public data: TData,
    private dataDrawer: P5DrawDataFunc<TContext>
  ) {
    const drawer: P5DrawFunc<TContext> = (p: p5, ctx: TContext) => {
      return this.dataDrawer(p, ctx, this.data);
    };
    super(drawer);
  }
}
