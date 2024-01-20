import { IPoint, ITransformMatrix, TPointListArg, applyMatrix, pointListFromArg } from "./points";

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
