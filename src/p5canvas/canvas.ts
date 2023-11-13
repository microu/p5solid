import p5 from "p5";

export interface ICanvasTime {
  t0: number; // start of drawing (ms) in p5 time
  t: number; // time of drawing: ms since t0
  dt: number; // time (ms) since last draw i
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
}

export type TItemParamTypes = number | string | object;
export type TItemParam<
  V extends TItemParamTypes = TItemParamTypes,
  TContext extends ICanvasTime = ICanvasTime
> = V | ((ctx: TContext) => V);

export function pv<
  V extends TItemParamTypes = TItemParamTypes,
  TContext extends ICanvasTime = ICanvasTime
>(ctx: TContext, v: TItemParam<V,TContext>): V {
  if (typeof v == "function") {
    return v(ctx);
  } else {
    return v;
  }
}

// // export type TCanvasParamTypes = number | string | object;

// export interface ICanvasParams {
//   get(name: string): any;
// }

// export class CanvasParamsBase implements ICanvasParams {
//   private params = new Map<string, any>();
//   constructor(
//     private parent?: ICanvasParams,
//     values?: [string, any][] | Map<string, any>
//   ) {
//     if (values != undefined) {
//       for (const [k, v] of values) {
//         this.set(k, v);
//       }
//     }
//   }

//   get(name: string): any {
//     return (
//       this.params.get(name) ??
//       (this.parent != undefined ? this.parent.get(name) : undefined)
//     );
//   }
//   set(name: string, v: any) {
//     this.params.set(name, v);
//   }
// }

export interface ICanvasItem<
  TContext extends ICanvasTime = CanvasTimeBase,
  TState = void
> {
  draw(p: p5, ctx: TContext): TState;
}
