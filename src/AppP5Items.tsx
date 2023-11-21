import { P5Div } from "./p5div";
import { sampleItemsGroupA } from "./p5samples/sample_itemsGroupA";
import { sampleItemsGroupB } from "./p5samples/sample_itemsGroupB";
import { sampleItemsGroupC } from "./p5samples/sample_itemsGroupC";
import { sampleSimpleSquare } from "./p5samples/simpleSquare";
import { resolveColor } from "./twconf";
import Header from "./ui/Header";

function AppP5Items() {
  console.log("APP");
  return (
    <>
      <Header title="P5JS / Solid - P5Items" />
      <div class="flex">
      <div class="m-auto grid grid-rows-2 grid-cols-2 gap-2 bg-stone-300">
        <P5Div runner={sampleItemsGroupA()}></P5Div>
        <P5Div runner={sampleItemsGroupB()}></P5Div>
        <P5Div runner={sampleItemsGroupC()}></P5Div>
        <P5Div runner={sampleSimpleSquare(resolveColor("red-400"))}></P5Div>
      </div>
      </div>
    </>
  );
}

export default AppP5Items;
