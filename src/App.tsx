import "./App.css";
import SketchDiv from "./SketchDiv";
import { SketchHandlerBase } from "./SketchHandlers";
import { steppingFeet } from "./sketches/SteppingFeet";
import twconf from "./twconf";

const handler = new SketchHandlerBase(
  (p: p5) => {
  console.log("[setup]");
},
(p: p5) => {
  console.log("[draw]");
})
;

function App() {
  return (
    <>
      <h1>Vite + Solid + P5</h1>
      <SketchDiv
        handler={steppingFeet({
          colorA: twconf.color("orange-900"),
          colorB: twconf.color("purple-100"),
          w: 300,
          h: 200,
        })}
      />
      <br/>
      <SketchDiv
        handler={steppingFeet({
          colorA: twconf.color("rose-700"),
          colorB: twconf.color("stone-300"),
          w: 300,
          h: 300,
          barWidth:12,
          rectWidth:4,
          rectHeight:4

        })}
      />

    </>
  );
}

export default App;
