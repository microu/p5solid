import Header from "./Header";
import * as Plot from "@observablehq/plot";
import { plotSinPeriodOffset } from "./plotSamples/sinPeriodOffset";
import { plotSinKeyPoints } from "./plotSamples/sinKeyPoint";
import { plotSinKeyPointsDec } from "./plotSamples/sinKeyPointDec";
import ItemSelector from "./ui/ItemSelector";
import { removeAllChildren } from "@microu-mts/dom";

function AppPlots() {
  let plotDiv: HTMLDivElement | undefined;
  let plotNames = ["Sin Offset", "Sin KP inc", "Sin KP dec"];
  let plots = [plotSinPeriodOffset(), plotSinKeyPoints(), plotSinKeyPointsDec()];
  let iplot = 0;

  function updatePlot(plot: HTMLElement | SVGSVGElement) {
    if (plotDiv == undefined) return;
    removeAllChildren(plotDiv!);
    plotDiv.appendChild(plot);
  }

  const r = (
    <>
      <Header title="P5JS / Solid => Plots" />
      <div class="m-auto flex bg-stone-300 ">
        <ItemSelector
          items={plotNames}
          handler={(label, i) => updatePlot(plots[i])}
        />
        <div ref={plotDiv} class="bg-stone-100"></div>
        <div class="flex-1">Right</div>
      </div>
    </>
  );
  updatePlot(plots[iplot]);
  return r;
}

export default AppPlots;
