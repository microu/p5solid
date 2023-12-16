import Header from "./Header";
import * as Plot from "@observablehq/plot";

import { PVSin } from "@src/pvalue/PVSin";

type TPlotData = {
  x: number;
  y: number;
  name: string;
};

const data = [] as TPlotData[];
const xa = -10;
const xb = 10;
const xdelta = xb - xa;

const pvsin = [] as PVSin[];

pvsin.push(new PVSin({ min: -10, max: 10, period: 2 }));
pvsin.push(new PVSin({ min: -10, max: 10, period: 2, periodShift: 0.1 }));
pvsin.push(new PVSin({ min: -10, max: 10, period: 2, periodShift: 0.3 }));

for (let i = 0; i <= 1000; i += 1) {
  const x = xa + (i * xdelta) / 1000;
  for (let j = 0; j < pvsin.length; j += 1) {
    const r: TPlotData = { x, y: pvsin[j].v(x), name: `y${j + 1}` };
    data.push(r);
  }
}
console.log(data);

function AppPlots() {
  let plotDiv: HTMLDivElement | undefined;

  const marks = [Plot.line(data, { x: "x", y: "y", stroke: "name" })];

  const plot = Plot.plot({
    width: 500,
    height: 250,
    style: "overflow: visible;",
    color: { type: "categorical", scheme: "dark2", legend: true },
    x: { grid: true },
    y: { grid: true },
    marks,
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
