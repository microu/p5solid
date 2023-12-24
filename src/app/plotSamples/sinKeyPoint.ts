import { PVSin } from "@src/pvalue/PVSin";
import * as Plot from "@observablehq/plot";
import { IKeyPoint } from "@src/pvalue";

export function plotSinKeyPoints() {
  const period = 4;
  const min = -10;
  const max = 10;

  const items = [] as { pvsin: PVSin; kp: IKeyPoint<number> }[];

  for (const kp of [
    { t: -7, v: -7 },
    { t: 3, v: 4 },
    { t: 3, v: -4 },
    { t: 7, v: -10 },
    { t: -6, v: 10 },
  ]) {
    items.push({
      pvsin: new PVSin({ min, max, period, keyPoint: kp }),
      kp,
    });
  }

  type TPlotData = {
    x: number;
    y: number;
    name: string;
  };

  const data = [] as TPlotData[];
  const dotsData = [] as TPlotData[];
  const xa = -10;
  const xb = 10;
  const xdelta = xb - xa;

  for (let j = 0; j < items.length; j += 1) {
    const item = items[j];
    const name = `y${j + 1}`;
    dotsData.push({ x: item.kp.t, y: item.kp.v, name });
    for (let i = 0; i <= 1000; i += 1) {
      const x = xa + (i * xdelta) / 1000;
      const r: TPlotData = { x, y: item.pvsin.v(x), name };
      data.push(r);
    }
  }


  const marks = [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(data, { x: "x", y: "y", stroke: "name" }),
    Plot.dot(dotsData, { x: "x", y: "y", stroke: "black", fill: "name", r:5 }),
  ];

  const plot = Plot.plot({
    width: 700,
    height: 350,
    style: "overflow: visible;",
    color: { type: "categorical", scheme: "dark2", legend: true },
    x: { grid: true },
    y: { grid: true },
    marks,
  });

  return plot;
}
