import p5 from "p5";
import { CanvasTimeBase, ICanvasItem, ICanvasTime } from "./canvas";

export type AdaptContextHook<
  TParentContext extends ICanvasTime,
  TChildContext extends ICanvasTime
> = (ctx: TParentContext) => TChildContext;

export type DrawHook<
  TParentContext extends ICanvasTime = CanvasTimeBase,
  TChildContext extends ICanvasTime = TParentContext
> = (
  cig: CanvasItemGroup<TParentContext, TChildContext>,
  p: p5,
  ctx: TChildContext
) => void;

export class CanvasItemGroup<
  TParentContext extends ICanvasTime = CanvasTimeBase,
  TChildContext extends ICanvasTime = TParentContext
> implements ICanvasItem<TParentContext>
{
  private childrens: ICanvasItem<TChildContext>[] = [];
  private _adaptContext:
    | AdaptContextHook<TParentContext, TChildContext>
    | undefined;
  private _preDraw: DrawHook<TParentContext, TChildContext> | undefined;
  private _postDraw: DrawHook<TParentContext, TChildContext> | undefined;

  constructor(options?: {
    childrens?: ICanvasItem<TChildContext>[];
    adaptContext?: AdaptContextHook<TParentContext, TChildContext>;
    preDraw?: DrawHook<TParentContext, TChildContext>;
    postDraw?: DrawHook<TParentContext, TChildContext>;
  }) {
    options ??= {};
    if (options.childrens != undefined) {
      this.childrens.push(...options.childrens);
    }
    this._adaptContext = options.adaptContext;
    this._preDraw = options.preDraw;
    this._postDraw = options.postDraw;
  }

  adapContext(ctx: TParentContext): TChildContext {
    if (this._adaptContext) {
      return this._adaptContext(ctx);
    }

    return ctx as unknown as TChildContext;
  }

  draw(p: p5, parentContext: TParentContext): string {
    const ctx = this.adapContext(parentContext);
    this.preDraw(p, ctx);

    const doneList: number[] = [];
    for (let i = 0; i < this.childrens.length; i += 1) {
      const child = this.childrens[i];
      const state = child.draw(p, ctx);
      if (state == "!done") {
        doneList.push(i);
      }
    }
    for (let i = doneList.length - 1; i >= 0; i -= 1) {
      const idone = doneList[i];
      this.childrens.splice(idone, 1);
    }

    this.postDraw(p, ctx);
    return "";
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

  appendChild(...childrens: ICanvasItem<TChildContext>[]) {
    this.childrens.push(...childrens);
  }

  get length(): number {
    return this.childrens.length;
  }
}
