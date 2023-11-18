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
