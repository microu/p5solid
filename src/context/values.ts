export type TContextParamTypes = number | string | object;
export type TContextParam<V extends TContextParamTypes = TContextParamTypes> =
  | V
  | ((v: IContextParams<V>) => V);

export function cp<V extends TContextParamTypes = TContextParamTypes>(
  ctx: IContextParams<V>,
  v: TContextParam<V>
): V {
  if (typeof v == "function") {
    return v(ctx);
  } else {
    return v;
  }
}

export interface IContextParams<
  V extends TContextParamTypes = TContextParamTypes
> {
  get(name: string): V | undefined;
}

export class ContextParamsBase<
  V extends TContextParamTypes = TContextParamTypes
> implements IContextParams<V>
{
  private values = new Map<string, TContextParam<V>>();
  constructor(private parent?: IContextParams<V>) {}

  get(name: string): V | undefined {
    let r = this.values.get(name);
    if (r != undefined) {
      return cp(this, r);
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    return undefined;
  }

  set(name: string, v: TContextParam<V>) {
    this.values.set(name, v);
  }
}
