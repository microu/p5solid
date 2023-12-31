import { P5Div } from "../p5div";
import { sampleA } from "./p5samples/sampleA";
import { sampleB } from "./p5samples/sampleB";
import AppLayoutHeader from "./AppLayoutHeader";

function App() {
  return (
    <>
      <AppLayoutHeader title="P5JS / Solid" />
      <div class="m-auto flex flex-col justify-between w-[800px] bg-stone-300 h-96">
        <P5Div runner={sampleA()}></P5Div>
        <div class="bg-stone-100 p-2">
          <p class="">
            Top and bottom banners on this page use only{" "}
            <code class="font-mono text-red-900">P5Div</code> and{" "}
            <code class="font-mono text-red-900">P5Runner</code>
          </p>
          <ul class="flex flex-col">
            <li class="m-0 list-disc list-inside">
              <a href="index_segment_samples.html">Segments Samples</a>
            </li>
            <li class="m-0 list-disc list-inside">
              <a href="index_plots.html">Plots</a>
            </li>
           </ul>
        </div>
        <P5Div runner={sampleB()}></P5Div>
      </div>
    </>
  );
}

export default App;
