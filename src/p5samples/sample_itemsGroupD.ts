import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";
import { resolveColor } from "../twconf";
import { IP5TimeContext, P5TimeContext } from "../p5div/P5Items";
import { P5ItemsGroup } from "../p5div/P5ItemsGroup";
import { P5Drawer } from "../p5div/P5Drawer";
import { colorChoices01 } from "./colorChoices";
import { TickableValue } from "../ticks/values";

export function sampleItemsGroupD(): P5Runner {
  // parameters
  const bgcolor = resolveColor("slate-900");
  const nItems = 11;

  // state
  let itemIndex = 0;
  const context = new P5TimeContext();
  let nextAppendChild = 0;

  // group + hooks
  const group = new P5ItemsGroup({ postDraw });
  function postDraw(ig: P5ItemsGroup, _p: p5, ctx: IP5TimeContext) {
    while (group.length < nItems && ctx.t > nextAppendChild) {
      if (itemIndex % 2 == 0) {
        ig.appendChild(createCircleItem(ctx.t));
      } else {
        ig.appendChild(createSquareItem(ctx.t));
      }
      itemIndex += 1;
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

function createCircleItem(t: number) {
  const lineColor =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];
  const vx = new TickableValue(28 + Math.random() * 228);
  const vy = new TickableValue(128);
  const endOfLife = t + 5000 + Math.random() * 12000;

  let nextEvent = t + Math.random() * 1500;

  return new P5Drawer((p, ctx) => {
    if (ctx.t > nextEvent) {
      const dt = Math.random() * 3000;
      let y = Math.random() * 256;
      while (Math.abs(y - vy.value()) < 50) {
        y = Math.random() * 256;
      }
      vy.addTarget({ t: ctx.t + dt, v: y });

      let x = Math.random() * 256;
      while (Math.abs(x - vx.value()) < 10 || Math.abs(x - vx.value()) > 80) {
        x = Math.random() * 256;
      }
      vx.addTarget({ t: ctx.t + dt, v: x });
      nextEvent += dt + 1000 * Math.random();
    }

    vx.tick(ctx.t);
    vy.tick(ctx.t);

    p.noFill();
    p.stroke(lineColor);
    p.strokeWeight(2);
    p.line(vx.value(), 0, vx.value(), 256);

    p.noStroke();
    p.fill(lineColor);
    p.circle(vx.value(), vy.value(), 12);

    return ctx.t < endOfLife ? "" : "!done";
  });
}

function createSquareItem(t: number) {
  const lineColor =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];
  const vx = new TickableValue(28 + Math.random() * 228);
  const vy = new TickableValue(128);
  const endOfLife = t + 5000 + Math.random() * 12000;

  let nextEvent = t + Math.random() * 1500;

  return new P5Drawer((p, ctx) => {
    if (ctx.t > nextEvent) {
      const dt = Math.random() * 3000;
      let y = Math.random() * 256;
      while (Math.abs(y - vy.value()) < 50) {
        y = Math.random() * 256;
      }
      vy.addTarget({ t: ctx.t + dt, v: y });

      let x = Math.random() * 256;
      while (Math.abs(x - vx.value()) < 10 || Math.abs(x - vx.value()) > 80) {
        x = Math.random() * 256;
      }
      vx.addTarget({ t: ctx.t + dt, v: x });
      nextEvent += dt + 1000 * Math.random();
    }

    vx.tick(ctx.t);
    vy.tick(ctx.t);

    p.noFill();
    p.stroke(lineColor);
    p.strokeWeight(2);
    p.line(vx.value(), 0, vx.value(), 256);

    p.noStroke();
    p.fill(lineColor);
    p.rectMode(p.CENTER);
    p.rect(vx.value(), vy.value(), 12, 12);

    return ctx.t < endOfLife ? "" : "!done";
  });
}
