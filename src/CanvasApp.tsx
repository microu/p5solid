import SketchDiv from "./SketchDiv";
import { circlesCanvasA } from "./p5canvas/circles/circlesCanvas";

function CanvasApp() {
  return (
    <div class="m-auto  w-fit flex flex-col justify-items-start gap-2 h-screen bg-amber-300">
      <SketchDiv handler={circlesCanvasA()}></SketchDiv>
    </div>
  );
}

export default CanvasApp;
