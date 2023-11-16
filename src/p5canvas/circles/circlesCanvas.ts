import p5 from "p5";
import { resolveColor } from "../../twconf";
import { ISketchHandler, SketchHandlerBase } from "../../SketchHandlers";
import { CanvasTimeBase, CanvasUpdatedItem } from "../canvas";
import { CircleItem, UpdatableCircleItem } from "./circleItem";
import { MaterialPoint } from "./materialPoint";

type TCircleEntry = {
  circle:
    | CircleItem
    | CanvasUpdatedItem<CanvasAContext, UpdatableCircleItem>;
  done: boolean;
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
  resolveColor("orange-600"),
  resolveColor("orange-800"),
  resolveColor("orange-950"),
];

class CanvasAContext extends CanvasTimeBase {
  lateralWind = 0;
}

export function circlesCanvasA(): ISketchHandler {
  const ctx = new CanvasAContext();
  const stillCircles: TCircleEntry[] = [];
  const fallingCircles: TCircleEntry[] = [];
  let nextFalling = 0;

  for (let i = 0; i < 10; i += 1) {
    stillCircles.push({ circle: buildStillCircle(), done: false });
  }

  function setup(p: p5) {
    p.createCanvas(200, 600);
    p.frameRate(24);
  }

  function draw(p: p5) {
    ctx.draw(p);
    ctx.lateralWind = Math.sin((Math.PI * 2 * ctx.t) / 5_000) * (0.0025 /1000);

    if (ctx.t >= nextFalling) {
      fallingCircles.push({ circle: buildFallingCircle(), done: false });
      nextFalling += 400;
        // 50 + Math.abs(Math.sin((ctx.t * Math.PI * 2) / 7000)) * 1000;
    }

    p.background(resolveColor("zinc-900"));
    for (let i = 0; i < stillCircles.length; i += 1) {
      const c = stillCircles[i];
      const state = c.circle.draw(p, ctx);
      if (state == "done") {
        c.done = true;
      }
    }
    for (let i = 0; i < fallingCircles.length; i += 1) {
      const c = fallingCircles[i];
      const state = c.circle.draw(p, ctx);
      if (state == "done") {
        c.done = true;
      }
    }

    updateCircles();
  }

  function updateCircles() {
    console.log("N:", stillCircles.length, fallingCircles.length);
    for (let i = 0; i < stillCircles.length; i += 1) {
      const c = stillCircles[i];
      if (c.done) {
        c.circle = buildStillCircle();
        c.done = false;
      }
    }
    for (let i = fallingCircles.length - 1; i >= 0; i -= 1) {
      const c = fallingCircles[i];
      if (c.done) {
        fallingCircles.splice(i, 1);
      }
    }
  }

  function buildStillCircle(): CircleItem {
    const color = colorChoice[Math.floor(Math.random() * colorChoice.length)];

    const diameter = 20 + Math.random() * 40;
    const t0 = ctx.t;
    const dur0 = 3000 + Math.random() * 10000;
    const dur1 = 500 + Math.random() * 4000;
    const duration = dur0 + dur1;

    return new CircleItem({
      x: 20 + Math.random() * 160,
      y: 100 + Math.random() * 700,
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
    });
  }

  function buildFallingCircle(): CanvasUpdatedItem<
    CanvasAContext,
    UpdatableCircleItem
  > {
    const color = colorChoice[Math.floor(Math.random() * colorChoice.length)];

    const mpoint = new MaterialPoint(100, 100, {
      vy: -80 / 1000,
      gravity: 0.05 / 1000,
      m: 1 + Math.floor(Math.random()* 3)
    });

    const x0 = 100;
    const y0 = 100;
    const d0 = 16;

    const updatableCircle = new UpdatableCircleItem(x0, y0, d0, color);

    return new CanvasUpdatedItem(updatableCircle, (item, ctx) => {
      mpoint.update(ctx.dt, ctx.lateralWind);
      item.x = mpoint.x;
      item.y = mpoint.y;

      if (item.y >= 612) {
        item.state = "done";
      }
      return ""
    });
  }

  return new SketchHandlerBase(setup, draw);
}
