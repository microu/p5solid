import { P5Div } from "@src/p5div";
import { tickRunableSampleA } from "./p5samples/sampleTickRunnableA";
import AppLayout from "./AppLayout";
import { tickRunableSampleB } from "./p5samples/sampleTickRunnableB";
import { createSignal } from "solid-js";
import { tickRunnableSampleC } from "./p5samples/sampleTickRunnableC";
import { collatzSampleA } from "./collatz/collatzSampleA";

const [running, setRunning] = createSignal(true);


function AppTickRunnables() {
  const pauseButtonText = () => (running() ? "Pause" : "Start");

  const [runnerA, engineA] = tickRunableSampleA(600, 90);
  const [runnerB, _engineB] = tickRunableSampleB();
  const [runnerC, _engineC] = tickRunnableSampleC(600,180)
  const [runnerCollatzA, _engineCollatzA] = collatzSampleA(600, 120)

 
  function toogleRun() {
    setRunning(!running());
    engineA.paused = !running()
  }
  
  return (
    <AppLayout title="P5 /Solid - Tick Runnables">
      <div class="flex flex-col gap-2 p-2 m-2 rounded-lg bg-amber-100 items-center">
        <div class="flex flex-col gap-1 items-center bg-stone-200 p-2">
          <P5Div runner={runnerA}></P5Div>
          <button
            onClick={() => toogleRun()}
            class="block w-24 rounded bg-blue-900 text-stone-200 font-bold p-1"
          >
            {pauseButtonText()}
          </button>
        </div>
        <P5Div runner={runnerB}></P5Div>
        <P5Div runner={runnerC}></P5Div>
        <P5Div runner={runnerCollatzA}></P5Div>
      </div>
    </AppLayout>
  );
}

export default AppTickRunnables;
