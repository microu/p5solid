export interface IPoint {
  x: number;
  y: number;
}

export interface IBox {
  min: IPoint;
  max: IPoint;
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

export function boxForPoints(points: IPoint[]): IBox {
  if (points.length == 0) {
    return { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
  }
  const min = { x: points[0].x, y: points[0].y };
  const max = { ...min };
  for (const p of points) {
    min.x = Math.min(min.x, p.x);
    min.y = Math.min(min.y, p.y);
    max.x = Math.max(max.x, p.x);
    max.y = Math.max(max.y, p.y);
  }
  return { min, max };
}

export interface ITransformMatrix {
  readonly ax: number;
  readonly ay: number;
  readonly ac: number;
  readonly bx: number;
  readonly by: number;
  readonly bc: number;
}

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
      x: m.ax * arg.x + m.ay * arg.y + m.ac,
      y: m.bx * arg.x + m.by * arg.y + m.bc,
    };
  }
}

export class PointSequence implements Iterable<IPoint> {
  private _points: IPoint[];
  private _transformedPoints: IPoint[] | undefined;
  private _matrix: ITransformMatrix | undefined;

  constructor(points: TPointListArg) {
    this._points = pointListFromArg(points);
  }

  set points(points: TPointListArg) {
    this._points = pointListFromArg(points);
    this._transformedPoints = undefined;
  }

  set matrix(m: ITransformMatrix | undefined) {
    this._matrix = m;
    this._transformedPoints = undefined;
  }

  get matrix() {
    return this._matrix;
  }

  _update() {
    if (this._transformedPoints != undefined) {
      return;
    }
    if (this._matrix == undefined) {
      this._transformedPoints = this._points;
    } else {
      this._transformedPoints = applyMatrix(this._matrix!, this._points);
    }
  }

  *[Symbol.iterator]() {
    this._update();
    for (const p of this._transformedPoints!) {
      yield p;
    }
  }

  *segments(): Generator<[IPoint, IPoint]> {
    this._update();
    for (let i = 0; i < this._transformedPoints!.length - 1; i += 1) {
      yield [this._transformedPoints![i], this._transformedPoints![i + 1]];
    }
  }
}
