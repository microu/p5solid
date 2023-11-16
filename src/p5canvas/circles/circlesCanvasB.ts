import p5 from "p5";
import { ISketchHandler, SketchHandlerBase } from "../../SketchHandlers";
import {
  CanvasTimeBase,
  CanvasUpdatedItem,
  ICanvasItem,
  ICanvasTime,
} from "../canvas";
import { CanvasItemGroup } from "../canvasItemGroup";
import { UpdatableCircleItem } from "./circleItem";
import { resolveColor } from "../../twconf";
import { MaterialPoint } from "./materialPoint";

const colorSequence01 = [
  resolveColor("rose-200"),
  resolveColor("rose-300"),
  resolveColor("rose-400"),
  resolveColor("rose-500"),
  resolveColor("rose-700"),
  resolveColor("rose-800"),
  resolveColor("rose-900"),
  resolveColor("rose-800"),
  resolveColor("rose-700"),
  resolveColor("rose-600"),
  resolveColor("rose-500"),
  resolveColor("rose-400"),
  resolveColor("rose-300"),
];

const colorSequence02 = [
  resolveColor("amber-200"),
  resolveColor("amber-300"),
  resolveColor("amber-400"),
  resolveColor("amber-500"),
  resolveColor("amber-700"),
  resolveColor("amber-800"),
  resolveColor("amber-900"),
  resolveColor("amber-800"),
  resolveColor("amber-700"),
  resolveColor("amber-600"),
  resolveColor("amber-500"),
  resolveColor("amber-400"),
  resolveColor("amber-300"),
];

const colorSequence03 = [
  resolveColor("emerald-200"),
  resolveColor("emerald-300"),
  resolveColor("emerald-400"),
  resolveColor("emerald-500"),
  resolveColor("emerald-700"),
  resolveColor("emerald-800"),
  resolveColor("emerald-900"),
  resolveColor("emerald-800"),
  resolveColor("emerald-700"),
  resolveColor("emerald-600"),
  resolveColor("emerald-500"),
  resolveColor("emerald-400"),
  resolveColor("emerald-300"),
];

class LateralWindContext extends CanvasTimeBase {
  lateralWind = 0;
}

export function circlesCanvasB(): ISketchHandler {
  const context = new CanvasTimeBase();

  const layers: ICanvasItem[] = [
    circleGroupB2(colorSequence01, 50),
    circleGroupB2(colorSequence02, 150),
    circleGroupB1(colorSequence03, 100),
  ];

  function setup(p: p5) {
    p.createCanvas(200, 600);
    p.frameRate(32);
  }

  function draw(p: p5) {
    context.draw(p);
    p.background(resolveColor("slate-700"));
    for (const layer of layers) {
      layer.draw(p, context);
    }
  }
  return new SketchHandlerBase(setup, draw);
}

function circleGroupB1(colors: string[], x: number): ICanvasItem {
  const group = new CanvasItemGroup({
    postDraw: updateItems,
  });

  let nextAppendChild = 0;

  function updateItems(cig: CanvasItemGroup, p: p5, ctx: CanvasTimeBase) {
    if (cig.length < 12 && ctx.t > nextAppendChild) {
      cig.appendChild(buildCircleB());
      nextAppendChild = ctx.t + 222 + Math.random() * 111;
    }
  }

  let colorIndex = 0;
  function buildCircleB(): ICanvasItem {
    const x0 = x;
    const y0 = 50;
    const d0 = 24;
    const color = colors[colorIndex];
    colorIndex = colorIndex + 1 < colors.length ? colorIndex + 1 : 0;
    const updatableCircle = new UpdatableCircleItem(x0, y0, d0, color);

    const mpoint = new MaterialPoint(x0, y0, {
      vy: 5 / 1000,
      gravity: 0.03 / 1000,
      m: 1 + Math.floor(Math.random() * 3),
    });

    return new CanvasUpdatedItem(updatableCircle, (item, ctx) => {
      mpoint.update(ctx.dt);
      item.x = mpoint.x;
      item.y = mpoint.y;

      if (item.y >= 612) {
        item.state = "!done";
      }
      return "";
    });
  }

  return group;
}

function circleGroupB2(colors: string[], x: number): ICanvasItem {
  const context = new LateralWindContext();
  const group = new CanvasItemGroup<ICanvasTime, LateralWindContext>({
    adaptContext: (parentContext) => {
      context.update(parentContext);
      context.lateralWind =
        Math.sin((Math.PI * 2 * context.t) / 5_000) * (0.01 / 1000);
      return context;
    },
    postDraw: updateItems,
  });

  let nextAppendChild = 0;

  function updateItems(
    cig: CanvasItemGroup<ICanvasTime, LateralWindContext>,
    p: p5,
    ctx: CanvasTimeBase
  ) {
    if (cig.length < 12 && ctx.t > nextAppendChild) {
      cig.appendChild(buildCircleB());
      nextAppendChild = ctx.t + 222 + Math.random() * 111;
    }
  }

  let colorIndex = 0;
  function buildCircleB(): ICanvasItem {
    const x0 = x;
    const y0 = 50;
    const d0 = 24;
    const color = colors[colorIndex];
    colorIndex = colorIndex + 1 < colors.length ? colorIndex + 1 : 0;
    const updatableCircle = new UpdatableCircleItem(x0, y0, d0, color);

    const mpoint = new MaterialPoint(x0, y0, {
      vy: 5 / 1000,
      gravity: 0.03 / 1000,
      m: 1 + Math.floor(Math.random() * 10),
    });

    return new CanvasUpdatedItem<LateralWindContext, UpdatableCircleItem>(
      updatableCircle,
      (item, ctx) => {
        mpoint.update(ctx.dt, ctx.lateralWind);
        item.x = mpoint.x;
        item.y = mpoint.y;

        if (item.y >= 612) {
          item.state = "!done";
        }
        return "";
      }
    );
  }

  return group;
}
