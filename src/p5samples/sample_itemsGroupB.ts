import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";
import { resolveColor } from "../twconf";
import { P5ItemsGroup } from "../p5div/P5ItemsGroup";
import { P5Drawer } from "../p5div/P5Drawer";
import { colorChoices01 } from "./colorChoices";
import { IP5TimeContext, P5TimeContext } from "../p5div/P5Items";

function createLineB0(t0: number) {
  const expiration = t0 + 3000 + 10000 * Math.random();
  const color =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];
  const aya = 1/30_000 * Math.sign(Math.random()-0.5);
  const ayb = 1/30_000 * Math.sign(Math.random()-0.5);
  let ya = Math.random() * 256;
  let yb = Math.random() * 256;
  let vya = 0;
  let vyb = 0;

  let size = 0;
  let expiring = false;

  return new P5Drawer((p, ctx) => {
    p.stroke(color);
    p.strokeWeight(2);
    p.noFill();

    if (!expiring) {
      if (size >= 1) {
        size = 1;
      } else {
        size += ((-0.1 + Math.random()) * ctx.dt) / 1500;
        size = Math.min(1, size);
      }
    } else {
      size -= ((-0.1 + Math.random()) * ctx.dt) / 500;
    }

    if (ya <= 0) {
      vya = Math.abs(vya)
    } else if (ya >= p.height) {
      vya =  - Math.abs(vya)
    }

    if (yb <= 0) {
      vyb = Math.abs(vyb)
    } else if (yb >= p.height) {
      vyb =  - Math.abs(vyb)
    }

    vya += aya * ctx.dt;
    ya += vya * ctx.dt;
    vyb += ayb * ctx.dt;
    yb += vyb * ctx.dt;

    const k0 = 0.5 - size / 2;
    const k1 = 0.5 + size / 2;
    const x0 = 0 + k0 * p.width;
    const x1 = 0 + k1 * p.width;
    const y0 = ya + k0 * (yb - ya);
    const y1 = ya + k1 * (yb - ya);

    p.line(x0, y0, x1, y1);

    if (ctx.t > expiration) {
      expiring = true;
    }

    return expiring && size < 0 ? "!done" : "";
  });
}

export function sampleItemsGroupB(): P5Runner {
  // parameters
  const bgcolor = resolveColor("pink-950");

  // state
  const context = new P5TimeContext();
  const nLines = 16;

  // group + hooks
  function postDraw(ig: P5ItemsGroup, p: p5, ctx: IP5TimeContext) {
    while (group.length < nLines) {
      ig.appendChild(createLineB0(ctx.t));
    }
  }

  const group = new P5ItemsGroup({ postDraw });

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
