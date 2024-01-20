export interface IPoint {
  x: number;
  y: number;
}

export interface IBox {
  a: IPoint;
  b: IPoint;
}

export type TPointArg = IPoint | [number, number];
export type TPointListArg = IPoint[] | [number, number][];

export function pointFromArg(arg: TPointArg): IPoint {
  if (Array.isArray(arg)) {
    return { x: arg[0], y: arg[1] };
  } else {
    return arg;
  }
}

export function pointListFromArg(arg: TPointListArg): IPoint[] {
  if (arg.length == 0) {
    return [];
  }
  if (Array.isArray(arg[0])) {
    return (arg as [number, number][]).map((xy) => ({ x: xy[0], y: xy[1] }));
  } else {
    return arg as IPoint[];
  }

  return [];
}

export function minMaxBoxForPoints(points: IPoint[]): IBox {
  if (points.length == 0) {
    return { a: { x: 0, y: 0 }, b: { x: 0, y: 0 } };
  }
  const min = { x: points[0].x, y: points[0].y };
  const max = { ...min };
  for (const p of points) {
    min.x = Math.min(min.x, p.x);
    min.y = Math.min(min.y, p.y);
    max.x = Math.max(max.x, p.x);
    max.y = Math.max(max.y, p.y);
  }
  return { a: min, b: max };
}

export interface ITransformMatrix {
  readonly ax: number;
  readonly bx: number;
  readonly cx: number;
  readonly ay: number;
  readonly by: number;
  readonly cy: number;
}

export const identityMatrix = { ax: 1, bx: 0, cx: 0, ay: 0, by: 1, cy: 0 };

export function applyMatrix(m: ITransformMatrix, arg: IPoint): IPoint;
export function applyMatrix(m: ITransformMatrix, arg: IPoint[]): IPoint[];
export function applyMatrix(
  m: ITransformMatrix,
  arg: IPoint | IPoint[]
): IPoint | IPoint[] {
  if (Array.isArray(arg)) {
    return arg.map((p) => applyMatrix(m, p));
  } else {
    return {
      x: m.ax * arg.x + m.bx * arg.y + m.cx,
      y: m.ay * arg.x + m.by * arg.y + m.cy,
    };
  }
}

export function boxMapMatrix(
  box0: IBox,
  box1: IBox,
  swapXY = false
): ITransformMatrix {
  if (swapXY) {
    const m: ITransformMatrix = {
      ax: 0,
      bx: (box1.b.x - box1.a.x) / (box0.b.y - box0.a.y),
      cx: box1.a.x - box0.a.y,
      ay: (box1.b.y - box1.a.y) / (box0.b.x - box0.a.x),
      by: 0,
      cy: box1.a.y - box0.a.x,
    };
    return m;
  } else {
    const m: ITransformMatrix = {
      ax: (box1.b.x - box1.a.x) / (box0.b.x - box0.a.x),
      bx: 0,
      cx: box1.a.x - box0.a.x,
      ay: 0,
      by: (box1.b.y - box1.a.y) / (box0.b.y - box0.a.y),
      cy: box1.a.y - box0.a.y,
    };
    return m;
  }
}
