import { Component } from "solid-js";
import { collatzSampleA } from "./collatz/collatzSampleA";
import AppLayout from "./AppLayout";
import { P5Div } from "@src/p5div";



const AppHomeCollatz: Component = () => {

    const [runnerCollatzA, _engineCollatzA] = collatzSampleA(600, 60)

    return (<AppLayout title="P5 /Solid - Collatz drawings">
      <div class="flex flex-col gap-2 p-2 m-2 rounded-lg bg-amber-100 items-center">
        <P5Div runner={runnerCollatzA}></P5Div>
      </div>
    </AppLayout>)

};

export default AppHomeCollatz;
