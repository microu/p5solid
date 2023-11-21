import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";
import { resolveColor } from "../twconf";
import { P5ItemsGroup } from "../p5div/P5ItemsGroup";
import { P5Drawer } from "../p5div/P5Drawer";
import { colorChoices01 } from "./colorChoices";
import { IP5TimeContext, P5TimeContext } from "../p5div/P5Items";
import { MaterialPoint } from "../geo2d";
export function sampleItemsGroupB(): P5Runner {
  // parameters
  const bgcolor = resolveColor("pink-950");
  const nLines = 12;

  // state
  const context = new P5TimeContext();
  let nextAppendChild = 0;

  // group + hooks
  const group = new P5ItemsGroup({ postDraw });
  function postDraw(ig: P5ItemsGroup, p: p5, ctx: IP5TimeContext) {
    while (group.length < nLines && ctx.t > nextAppendChild) {
      ig.appendChild(createLineB0(ctx.t));
      nextAppendChild = ctx.t + Math.random() * 400;
    }
  }

  function setup(p: p5) {
    p.createCanvas(256, 256);
    p.frameRate(32);
  }

  function draw(p: p5) {
    context.draw(p);
    p.background(bgcolor);
    group.draw(p, context);
  }

  return new P5Runner(setup, draw);
}

//
// Lines
//

function createLineB0(t0: number) {
  const expiration = t0 + 6000 + 6000 * Math.random();
  const color =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];

  const ga = (1 / 30_000) * Math.sign(Math.random() - 0.5);
  const gb = (1 / 30_000) * Math.sign(Math.random() - 0.5);
  const pa = new MovingPoint(0, Math.random() * 256, {
    gravity: ga,
    xmax: 256,
    ymax: 256,
  });
  const pb = new MovingPoint(256, Math.random() * 256, {
    gravity: gb,
    xmax: 256,
    ymax: 256,
  });

  let size = 0;
  let expiring = false;

  return new P5Drawer((p, ctx) => {
    if (size >= 1) {
      let fxa = ((32 - pa.x) * 1) / 1_000_000;
      fxa = fxa < 0 ? 10 * fxa : fxa;
      let fxb = ((224 - pb.x) * 1) / 1_200_000;
      fxb = fxb > 0 ? 10 * fxb : fxb;

      pa.update(ctx.dt, fxa);
      pb.update(ctx.dt, fxb);
    } else {
      pa.update(ctx.dt);
      pb.update(ctx.dt);
    }

    p.stroke(color);
    p.strokeWeight(2);
    p.noFill();

    if (!expiring) {
      if (size >= 1) {
        size = 1;
      } else {
        size += ((-0.1 + Math.random()) * ctx.dt) / 200;
        size = Math.min(1, size);
      }
    } else {
      size -= ((-0.1 + Math.random()) * ctx.dt) / 300;
    }

    const k0 = 0.5 - size / 2;
    const k1 = 0.5 + size / 2;
    const x0 = pa.x + k0 * (pb.x - pa.x);
    const x1 = pa.x + k1 * (pb.x - pa.x);
    const y0 = pa.y + k0 * (pb.y - pa.y);
    const y1 = pa.y + k1 * (pb.y - pa.y);

    p.line(x0, y0, x1, y1);

    if (ctx.t > expiration) {
      expiring = true;
    }

    return expiring && size < 0 ? "!done" : "";
  });
}

//
// Moving Point
//

type TMovingPointOptions = {
  m: number;
  gravity: number;
  vx: number;
  vy: number;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
};

const defaultMovingPointOptions: TMovingPointOptions = {
  m: 1,
  gravity: 1 / 10_000,
  vx: 0,
  vy: 0,
  xmin: 0,
  xmax: 1,
  ymin: 0,
  ymax: 1,
};

class MovingPoint extends MaterialPoint {
  options: TMovingPointOptions;
  constructor(x0: number, y0: number, options?: Partial<TMovingPointOptions>) {
    const opt = {
      ...defaultMovingPointOptions,
      ...options,
    };
    super(x0, y0, { m: opt.m, gravity: opt.gravity, vx: opt.vx, vy: opt.vy });
    this.options = opt;
  }

  update(dt: number, fx = 0, fy = 0) {
    super.update(dt, fx, fy);
    if (this.x < this.options.xmin) {
      this.vx = Math.abs(this.vx);
    } else if (this.x > this.options.xmax) {
      this.vx = -Math.abs(this.vx);
    }

    if (this.y < this.options.ymin) {
      this.vy = Math.abs(this.vy);
    } else if (this.y > this.options.ymax) {
      this.vy = -Math.abs(this.vy);
    }
  }
}
