import { Component } from "solid-js";
import { collatzSampleA } from "./collatz/collatzSampleA";
import AppLayout from "./AppLayout";
import { P5Div } from "@src/p5div";

const AppHomeCollatz: Component = () => {
  const w = 400;
  const h = 80;

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
  const [runnerCollatzA5, _engineCollatzA5] = collatzSampleA(w, h,{
    origin: "tr",
  });

  return (
    <AppLayout title="P5 /Solid - Collatz drawings">
      <div class="grid grid-cols-[20%_60%_20%]  gap-2 bg-amber-100">
        <div>AAA</div>
        <P5Div runner={runnerCollatzA1}></P5Div>
        <div>BBB</div>
        <P5Div runner={runnerCollatzA2}></P5Div>
        <P5Div runner={runnerCollatzA3}></P5Div>
        <P5Div runner={runnerCollatzA4}></P5Div>
        <div>CCC</div>
        <P5Div runner={runnerCollatzA5}></P5Div>
        <div>DDD</div>
      </div>
    </AppLayout>
  );
};

export default AppHomeCollatz;
