import { P5Div } from "@src/p5div";
import { tickRunableSampleA } from "./p5samples/sampleTickRunnableA";
import AppLayout from "./AppLayout";
import { tickRunableSampleB } from "./p5samples/sampleTickRunnableB";

function AppTickRunnables() {
  return (
    <AppLayout title="P5 /Solid - Tick Runnables">
      <div class="flex flex-col gap-2 p-2 m-2 rounded-lg bg-amber-100 items-center" >
      <P5Div runner={tickRunableSampleA(600, 90)}></P5Div>
      <P5Div runner={tickRunableSampleB()}></P5Div>
      </div>
    </AppLayout>
  );
}

export default AppTickRunnables;
