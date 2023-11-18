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
        <div class="bg-stone-100"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae, asperiores doloremque debitis impedit, corporis dignissimos mollitia, quam sequi porro corrupti nobis aliquam minus fugiat. Et rem suscipit eveniet odit. Mollitia!</p></div>
        <P5Div runner={sampleB()}></P5Div>
      </div>
    </>
  );
}

export default App;
