import { Component } from "solid-js";
import { collatzSampleA } from "./collatz/collatzSampleA";
import AppLayout from "./AppLayout";
import { P5Div } from "@src/p5div";

function styleP5Canvas(canvas: HTMLCanvasElement) {
  canvas.style.borderRadius = "6px";
}

const AppHomeCollatz: Component = () => {
  const w = 500;
  const h = 100;

  const [runnerCollatzA1, _engineCollatzA1] = collatzSampleA(w, h, {
    origin: "bl",
  });
  const [runnerCollatzA2, _engineCollatzA2] = collatzSampleA(h, w, {
    origin: "br",
    swapXY: true,
  });
  const [runnerCollatzA3, _engineCollatzA3] = collatzSampleA(w, w, {
    origin: "bl",
    margin: 20,
  });
  const [runnerCollatzA4, _engineCollatzA4] = collatzSampleA(h, w, {
    origin: "tl",
    swapXY: true,
  });
  const [runnerCollatzA5, _engineCollatzA5] = collatzSampleA(w, h, {
    origin: "tr",
  });

  return (
    <AppLayout title="P5 /Solid - Collatz drawings">
      <div class="_wrapper flex w-full bg-stone-100">
        <div class="m-auto grid grid-cols-[110px_500px_110px] gap-1 bg-amber-900">
          <div class="">AAA</div>
          <P5Div
            runner={runnerCollatzA1}
            class="rounded-lg"
            initCanvas={styleP5Canvas}
          ></P5Div>
          <div class="">BBB</div>
          <P5Div
            runner={runnerCollatzA2}
            class="justify-self-end"
            initCanvas={styleP5Canvas}
          ></P5Div>
          <P5Div
            runner={runnerCollatzA3}
            class=""
            initCanvas={styleP5Canvas}
          ></P5Div>
          <P5Div
            runner={runnerCollatzA4}
            class="justify-self-start"
            initCanvas={styleP5Canvas}
          ></P5Div>
          <div class="">CCC</div>
          <P5Div
            runner={runnerCollatzA5}
            class=""
            initCanvas={styleP5Canvas}
          ></P5Div>
          <div class="">DDD</div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AppHomeCollatz;
