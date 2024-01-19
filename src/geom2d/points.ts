export interface IPoint {
  x: number;
  y: number;
}

export interface IBox {
  min: IPoint;
  max: IPoint;
}

export type TPointArg = IPoint | [number, number];

export function ipoint(arg: TPointArg): IPoint {
  if (Array.isArray(arg)) {
    return { x: arg[0], y: arg[1] };
  } else {
    return arg;
  }
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
