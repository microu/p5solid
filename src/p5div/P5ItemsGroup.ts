import p5 from "p5";
import { IP5Item, IP5TimeContext, P5TimeContext } from "./P5Items";

export class P5ItemsGroup<
  TContext extends IP5TimeContext = P5TimeContext,
  TChildContext extends IP5TimeContext = TContext
> implements IP5Item<TContext>
{
  private children: IP5Item<TChildContext>[];
  private _adaptContext: AdaptContextHook<TContext, TChildContext> | undefined;
  private _postDraw: DrawHook<TContext, TChildContext> | undefined;
  private _preDraw: DrawHook<TContext, TChildContext> | undefined;
  constructor(
    options: {
      children?: IP5Item<TChildContext>[];
      adaptContext?: AdaptContextHook<TContext, TChildContext>;
      preDraw?: DrawHook<TContext, TChildContext>;
      postDraw?: DrawHook<TContext, TChildContext>;
    } = {}
  ) {
    this.children = options.children != undefined ? [...options.children] : [];
    this._adaptContext = options.adaptContext;
    this._preDraw = options.preDraw;
    this._postDraw = options.postDraw;
  }

  draw(p: p5, ctx: TContext): string {
    // update
    const childContext = this.adaptContext(ctx);
    this.preDraw(p, childContext);

    //draw
    const doneList: number[] = [];
    for (let i = 0; i < this.children.length; i += 1) {
      const child = this.children[i];
      const state = child.draw(p, childContext);
      if (state == "!done") {
        doneList.push(i);
      }
    }

    // delete !done items
    for (let i = doneList.length - 1; i >= 0; i -= 1) {
      const idone = doneList[i];
      this.children.splice(idone, 1);
    }

    // post actions
    this.postDraw(p, childContext);

    return "";
  }

  adaptContext(parentContext: TContext): TChildContext {
    if (this._adaptContext != undefined) {
      return this._adaptContext(parentContext);
    }
    return parentContext as unknown as TChildContext;
  }

  preDraw(p: p5, ctx: TChildContext) {
    if (this._preDraw != undefined) {
      this._preDraw(this, p, ctx);
    }
  }

  postDraw(p: p5, ctx: TChildContext) {
    if (this._postDraw != undefined) {
      this._postDraw(this, p, ctx);
    }
  }
}

export type DrawHook<
  TParentContext extends IP5TimeContext = P5TimeContext,
  TChildContext extends IP5TimeContext = TParentContext
> = (
  cig: P5ItemsGroup<TParentContext, TChildContext>,
  p: p5,
  ctx: TChildContext
) => void;

export type AdaptContextHook<
  TParentContext extends IP5TimeContext,
  TChildContext extends IP5TimeContext
> = (ctx: TParentContext) => TChildContext;
