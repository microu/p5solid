import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";
import { resolveColor } from "../twconf";
import { P5ItemsGroup } from "../p5div/P5ItemsGroup";
import { P5Drawer } from "../p5div/P5Drawer";
import { colorChoices01 } from "./colorChoices";
import { IP5TimeContext, P5TimeContext } from "../p5div/P5Items";
import { MaterialPoint } from "../geo2d";
export function sampleItemsGroupC(): P5Runner {
  // parameters
  const bgcolor = resolveColor("pink-950");
  const nItems = 12;

  // state
  const context = new P5TimeContext();
  let nextAppendChild = 0;

  // group + hooks
  const group = new P5ItemsGroup({ postDraw });
  function postDraw(ig: P5ItemsGroup, p: p5, ctx: IP5TimeContext) {
    while (group.length < nItems && ctx.t > nextAppendChild) {
      ig.appendChild(createItemC(ctx.t));
      nextAppendChild = ctx.t + Math.random() * 1000;
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
// Items
//

function createItemC(t0: number) {
  const expiration = t0 + 2000 + 6000 * Math.random();
  const color =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];

  const x = 24 + Math.random() * 200;
  const y = 24 + Math.random() * 200;
  const size = 24 + Math.random() * 64;
  return new P5Drawer((p, ctx) => {
    p.noStroke();
    p.fill(color);
    p.rectMode(p.CENTER);
    p.rect(x, y, size, size);
    return ctx.t > expiration ? "!done" : "";
  });
}

