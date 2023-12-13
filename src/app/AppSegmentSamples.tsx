import p5 from "p5";
import { P5Div } from "../p5div";
import Header from "./Header";
import { resolveColor } from "./twconf";
import { P5Runner } from "@src/p5div/P5Runner";
import { ClockBase } from "@src/segments/tickables";
import {
  InterpolateColorSegment,
  InterpolateSegment,
  MirrorValueSegment,
  RepeatValueSegment,
} from "@src/segments";
import {
  easeBackInOut,
  easeBounceInOut,
  easeBounceOut,
  easeCircleInOut,
  easeCubicInOut,
  easeElasticIn,
  easeElasticInOut,
  easeExpInOut,
  easeSinInOut,
} from "d3-ease";

function AppSegmentsamples() {
  return (
    <>
      <Header title="P5JS / Solid - abv samples" />
      <div class="flex">
        <div class="m-auto flex flex-col justify-between  bg-stone-300 gap-2 p-2">
           <P5Div
            runner={circleInRect("slate-800", "orange-700", "orange-200")}
          ></P5Div>
          <P5Div
            runner={circleInRect("stone-500", "pink-600", "pink-300")}
          ></P5Div>
          <P5Div
            runner={circleInRect("cyan-800", "emerald-700", "emerald-400")}
          ></P5Div>
          <P5Div
            runner={circleInRect("zinc-500", "yellow-600", "orange-700")}
          ></P5Div>
        </div>
      </div>
    </>
  );
}

function circleInRect(bgcolor: string, colora: string, colorb: string) {
  bgcolor = resolveColor(bgcolor);
  colora = resolveColor(colora);
  colorb = resolveColor(colorb);
  const clock = new ClockBase({ scale: 1 / 1000, t0: 0 });

  // const delta = Math.random() * 10;
  const delta = 20 + Math.random() * 10;
  const cx =new RepeatValueSegment( new MirrorValueSegment(
    new InterpolateSegment(
      {
        a: delta,
        va: 50,
        b: delta + 2 + Math.random() * 5,
        vb: 550,
      },
      { easing: easeBackInOut }
    )
  ));

  const t0 = Math.random();
  const color = new InterpolateColorSegment(
    { a: t0, va: colora, b: t0 + 0.5 + Math.random() * 1.5, vb: colorb },
    { easing: easeSinInOut }
  );

  const cy = 45;
  const d = 66;

  function setup(p: p5) {
    p.createCanvas(600, 90);
    p.frameRate(32);
  }

  function draw(p: p5) {
    clock.tick(p.millis());
    p.background(bgcolor);
    p.noStroke();
    p.fill(color.v(clock.t));
    p.circle(cx.v(clock.t), cy, d);
  }

  return new P5Runner(setup, draw);
}

export default AppSegmentsamples;
