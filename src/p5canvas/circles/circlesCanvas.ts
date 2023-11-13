import p5 from "p5";
import { resolveColor } from "../../twconf";
import { ISketchHandler, SketchHandlerBase } from "../../SketchHandlers";
import { CanvasTimeBase } from "../canvas";
import { CircleItem } from "./circleItem";

type TCircleEntry = {
  circle: CircleItem;
};

const colorChoice = [
  resolveColor("amber-300"),
  resolveColor("amber-700"),
  resolveColor("rose-900"),
  resolveColor("rose-500"),
  resolveColor("rose-200"),
  resolveColor("stone-200"),
  resolveColor("stone-500"),
  resolveColor("stone-700"),
  resolveColor("red-600"),
  resolveColor("red-800"),
  resolveColor("red-950"),
];

export function circlesCanvasA(): ISketchHandler {
  const ctx = new CanvasTimeBase();

  const circles: TCircleEntry[] = [];

  function setup(p: p5) {
    p.createCanvas(200, 200);
    p.frameRate(24);
  }

  function draw(p: p5) {
    ctx.draw(p);
    p.background(resolveColor("zinc-900"));
    const done = [] as number[];
    for (let i = 0; i < circles.length; i += 1) {
      const c = circles[i];
      const state = c.circle.draw(p, ctx);
      if (state == "done") {
        done.push(i);
      }
    }
    // console.log("DONE L:", done.length);
    for (let idone = done.length - 1; idone >= 0; idone -= 1) {
      const index = done[idone];
      circles.splice(index, 1);
    }
    updateCircles();
  }

  function updateCircles() {
    while (circles.length < 12) {
      console.log("PUSH CIRCLE");
      const color = colorChoice[Math.floor(Math.random() * colorChoice.length)];

      const diameter = 20 + Math.random() * 40;
      const t0 = ctx.t;
      const dur0 = 3000 + Math.random() * 10000;
      const dur1 = 500 + Math.random() * 4000;
      const duration = dur0 + dur1;
      console.log("DUR", duration);

      circles.push({
        circle: new CircleItem({
          x: 20 + Math.random() * 160,
          y: 20 + Math.random() * 160,
          d: (ctx) => {
            const t = ctx.t - t0;
            if (t <= dur0) {
              return diameter;
            } else if (t <= duration) {
              return (1 - (t - dur0) / dur1) * diameter;
            } else {
              return 0;
            }
          },
          color,
          state: (ctx) => (ctx.t - t0 < duration ? "" : "done"),
        }),
      });
    }
  }

  return new SketchHandlerBase(setup, draw);
}
