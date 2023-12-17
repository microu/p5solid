import Header from "./Header";
import * as Plot from "@observablehq/plot";
import { plotSinPeriodOffset } from "./plotSamples/sinPeriodOffset";
import { plotSinKeyPoints } from "./plotSamples/sinKeyPoint";


function AppPlots() {
  let plotDiv: HTMLDivElement | undefined;


  const r = (
    <>
      <Header title="P5JS / Solid => Plots" />
      <div class="m-auto flex flex-col items-center justify-between w-[800px] bg-stone-300 py-4">
        <p>Plots...</p>
        <div ref={plotDiv} class="bg-stone-100"></div>
      </div>
    </>
  );
  plotDiv!.append(plotSinKeyPoints());
  return r;
}

export default AppPlots;
