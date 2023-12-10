import p5 from "p5";
import { P5Div } from "../p5div";
import Header from "./Header";
import { resolveColor } from "./twconf";
import { P5Runner } from "@src/p5div/P5Runner";
import { ClockBase } from "@src/segments/tickables";
import { InterpolateSegment, SegmentedValue } from "@src/segments";
import { easeSinInOut } from "d3-ease";

function AppABVsamples() {
  return (
    <>
      <Header title="P5JS / Solid - abv samples" />
      <div class="flex">
        <div class="m-auto flex flex-col justify-between  bg-stone-300 gap-2 p-2">
          <P5Div
            runner={circleInRect(
              resolveColor("slate-600"),
              resolveColor("orange-700")
            )}
          ></P5Div>
          {/* <P5Div
            runner={circleInRect(
              resolveColor("stone-500"),
              resolveColor("pink-800")
            )}
          ></P5Div>
          <P5Div
            runner={circleInRect(
              resolveColor("cyan-800"),
              resolveColor("emerald-700")
            )}
          ></P5Div> */}
        </div>
      </div>
    </>
  );
}

function circleInRect(bgcolor: string, color: string) {
  const clock = new ClockBase({ scale: 1 / 1000, t0: 0 });

  const cx = new InterpolateSegment(
    {
      a: 0,
      va: 50,
      b: 10 + Math.random() * 10,
      vb: 550,
    },
    //{ easing: easeSinInOut }
  );

  const cy = 50;
  const d = 66;

  function setup(p: p5) {
    p.createCanvas(600, 90);
    p.frameRate(32);
    clock.tick(p.millis());
  }
  
  function draw(p: p5) {
    clock.tick(p.millis());
    p.background(bgcolor);
    p.noStroke();
    p.fill(color);
    p.circle(cx.v(clock.t), cy, d);
  }

  return new P5Runner(setup, draw);
}

export default AppABVsamples;
