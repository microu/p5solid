import "./App.css";
import SketchDiv from "./SketchDiv";
import { steppingFeet } from "./sketches/SteppingFeet";
import { particlesSketch } from "./sketches/particlesSketch";
import twconf from "./twconf";

function App() {
  return (
    <>
      <h1>Vite + Solid + P5</h1>
      <SketchDiv handler={particlesSketch({})} />
      <br />
      <SketchDiv
        handler={steppingFeet({
          colorA: twconf.color("rose-700"),
          colorB: twconf.color("stone-300"),
          w: 300,
          h: 150,
          barWidth: 6,
          rectWidth: 6,
          rectHeight: 2.3,
        })}
      />
    </>
  );
}

export default App;
