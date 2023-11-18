import { IP5Item, IP5TimeContext, P5TimeContext } from "./P5Items";

export type P5ItemUpdateFunc<
  TContext extends IP5TimeContext =P5TimeContext,
  TItem extends IP5Item<TContext> = IP5Item<TContext>
> = (ctx: TContext, item: TItem) => void;

export class P5ItemUpdater<
  TContext extends IP5TimeContext,
  TItem extends IP5Item<TContext>
> implements IP5Item<TContext>
{
  constructor(
    private item: TItem,
    private update: P5ItemUpdateFunc<TContext, TItem>
  ) {}

  draw(p: import("p5"), ctx: TContext): string {
    this.update(ctx, this.item);
    return this.item.draw(p, ctx);
  }
}
