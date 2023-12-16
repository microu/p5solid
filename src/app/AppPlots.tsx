import Header from "./Header";
import * as Plot from "@observablehq/plot";

import { PVSin } from "@src/pvalue/PVSin";

type TPlotData = {
  x: number;
  y1: number;
  y2: number;
  y3: number;
};

function AppPlots() {
  let plotDiv: HTMLDivElement | undefined;

  const pvsin1 = new PVSin({ min: -10, max: 10, period: 5 });
  const pvsin2 = new PVSin({ min: -10, max: 10, period: 5, periodShift: 0.1 });
  const kp3 = { t: -1, v: -2 };
  const pvsin3 = new PVSin({ min: -10, max: 10, period: 5, keyPoint: kp3 });

  const data = [] as TPlotData[];
  const xa = -10;
  const xb = 10;
  const xdelta = xb - xa;

  for (let i = 0; i <= 1000; i++) {
    const x = xa + (i * xdelta) / 1000;
    const y1 = pvsin1.v(x);
    const y2 = pvsin2.v(x);
    const y3 = pvsin3.v(x);
    data.push({ x, y1, y2, y3 });
  }

  const plot = Plot.plot({
    width: 500,
    height: 250,
    style: "overflow: visible;",
    x: { grid: true },
    y: { grid: true },
    marks: [
      Plot.line(data, { x: "x", y: "y1", stroke: "darkred" }),
      Plot.line(data, { x: "x", y: "y2", stroke: "darkgreen" }),
      Plot.line(data, {
        x: "x",
        y: "y3",
        stroke: "darkorange",
        strokeWidth: 2.5,
      }),
      Plot.dot(
        [
          [0, 0],
          [0.5, 0],
          [kp3.t, kp3.v],
        ],
        { symbol: "circle", fill: "red", stroke: "darkgreen" }
      ),
    ],
  });

  const r = (
    <>
      <Header title="P5JS / Solid => Plots" />
      <div class="m-auto flex flex-col items-center justify-between w-[800px] bg-stone-300 py-4">
        <p>Plots...</p>
        <div ref={plotDiv} class="bg-stone-100"></div>
      </div>
    </>
  );
  plotDiv!.append(plot);
  return r;
}

export default AppPlots;
