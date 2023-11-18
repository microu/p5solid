import { P5Div } from "./p5div";
import { sampleA } from "./p5samples/sampleA";
import { sampleB } from "./p5samples/sampleB";
import Header from "./ui/Header";

function App() {
  console.log("APP");
  return (
    <>
      <Header title="P5JS / Solid" />
      <div class="m-auto flex flex-col justify-between w-[800px] bg-stone-300 h-96">
        <P5Div runner={sampleA()}></P5Div>
        <P5Div runner={sampleB()}></P5Div>
      </div>
    </>
  );
}

export default App;
