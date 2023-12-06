import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";
import { resolveColor } from "../twconf";
import { IP5TimeContext, P5TimeContext } from "../p5div/P5Items";
import { P5ItemsGroup } from "../p5div/P5ItemsGroup";
import { P5Drawer } from "../p5div/P5Drawer";
import { colorChoices01 } from "./colorChoices";
import { TickableValue } from "../ticks/values";
import { TimedNumber, sinInOutInterpolator } from "../ticks/TimedValue";

export function sampleItemsGroupD(): P5Runner {
  // parameters
  const bgcolor = resolveColor("slate-900");
  const nItems = 77;

  // state
  let itemIndex = 0;
  const context = new P5TimeContext();
  let nextAppendChild = 0;

  // group + hooks
  const group = new P5ItemsGroup({ postDraw });
  function postDraw(ig: P5ItemsGroup, _p: p5, ctx: IP5TimeContext) {
    while (group.length < nItems && ctx.t > nextAppendChild) {
      if (itemIndex % 3 == 0) {
        ig.appendChild(createCircleItem(ctx.t));
      } else if (itemIndex % 3 == 1){
        ig.appendChild(createDiamondItem(ctx.t));
      } else  {
        ig.appendChild(createSquareItem(ctx.t));
      }
      itemIndex += 1;
      nextAppendChild = ctx.t + Math.random() * 100;
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
  const endOfLife = t + 6000 + Math.random() * 12000;

  let x = 28 + Math.random() * 228;
  const vx = new TimedNumber([{ t, v: x }], sinInOutInterpolator);

  let y = 28 + Math.random() * 228;
  const vy = new TimedNumber([{ t, v: y }], sinInOutInterpolator);

  let dt = 500 + Math.random() * 1500;
  while (t + dt <= endOfLife) {
    x = generateUntil(
      () => 28 + Math.random() * 228,
      (v) => Math.abs(v - x) > 10 && Math.abs(v - x) < 100
    );
    vx.addKeyPoint({ t: t + dt, v: x });
    dt += 500 + Math.random() * 1500;
  }

  dt = 500 + Math.random() * 1500;
  while (t + dt <= endOfLife) {
    y = generateUntil(
      () => 28 + Math.random() * 228,
      (v) => Math.abs(v - y) > 20 && Math.abs(v - x) < 150
    );
    vy.addKeyPoint({ t: t + dt, v: y });
    dt += 500 + Math.random() * 1000;
  }

  return new P5Drawer((p, ctx) => {
    const x = vx.v(ctx.t);
    const y = vy.v(ctx.t);

    p.noFill();
    p.stroke(lineColor);
    p.strokeWeight(1);
    p.line(x, 0, x, 256);

    p.noStroke();
    p.fill(lineColor);
    p.circle(x, y, 12);

    return ctx.t < endOfLife ? "" : "!done";
  });
}

function createDiamondItem(t: number) {
  const t0 = t;
  const lineColor =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];
  const endOfLife = t + 6000 + Math.random() * 12000;

  let x = 28 + Math.random() * 228;
  const vx = new TimedNumber([{ t, v: x }], sinInOutInterpolator);

  let y = 28 + Math.random() * 228;
  const vy = new TimedNumber([{ t, v: y }], sinInOutInterpolator);

  let dt = 500 + Math.random() * 1500;
  while (t + dt <= endOfLife) {
    x = generateUntil(
      () => 28 + Math.random() * 228,
      (v) => Math.abs(v - x) > 10 && Math.abs(v - x) < 100
    );
    vx.addKeyPoint({ t: t + dt, v: x });
    dt += 500 + Math.random() * 1500;
  }

  dt = 500 + Math.random() * 1500;
  while (t + dt <= endOfLife) {
    y = generateUntil(
      () => 28 + Math.random() * 228,
      (v) => Math.abs(v - y) > 20 && Math.abs(v - x) < 150
    );
    vy.addKeyPoint({ t: t + dt, v: y });
    dt += 500 + Math.random() * 1000;
  }

  return new P5Drawer((p, ctx) => {
    const x = vx.v(ctx.t);
    const y = vy.v(ctx.t);
    const r = 9 + 3 * Math.sin((2 * Math.PI * (ctx.t -t0)) / 3000);

    p.noFill();
    p.stroke(lineColor);
    p.strokeWeight(1);
    p.line(x, 0, x, 256);

    p.noStroke();
    p.fill(lineColor);
    p.beginShape();
    p.vertex(x, y - r);
    p.vertex(x + r, y);
    p.vertex(x, y + r);
    p.vertex(x - r, y);
    p.endShape(p.CLOSE);

    return ctx.t < endOfLife ? "" : "!done";
  });
}

function createSquareItem(t: number) {
  const lineColor =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];
  const vx = new TickableValue(28 + Math.random() * 228);
  const vy = new TickableValue(128);
  const endOfLife = 5000 + Math.random() * 12000;

  let nextEvent = Math.random() * 1500;

  return new P5Drawer((p, ctx) => {
    vx.tick(ctx.t);
    vy.tick(ctx.t);
    const t = vx.t; // == vy.t

    if (t > nextEvent) {
      const dt = Math.random() * 3000;
      let y = Math.random() * 256;
      while (Math.abs(y - vy.value()) < 50) {
        y = Math.random() * 256;
      }
      vy.addTarget({ t: t + dt, v: y });

      let x = Math.random() * 256;
      while (Math.abs(x - vx.value()) < 10 || Math.abs(x - vx.value()) > 80) {
        x = Math.random() * 256;
      }
      vx.addTarget({ t: t + dt, v: x });
      nextEvent += dt + 1000 * Math.random();
    }

    p.noFill();
    p.stroke(lineColor);
    p.strokeWeight(1);
    p.line(vx.value(), 0, vx.value(), 256);

    p.noStroke();
    p.fill(lineColor);
    p.rectMode(p.CENTER);
    p.rect(vx.value(), vy.value(), 12, 12);

    return t < endOfLife ? "" : "!done";
  });
}

function generateUntil<T>(generator: () => T, filter: (v: T) => boolean): T {
  let v = generator();
  while (!filter(v)) {
    v = generator();
  }
  return v;
}
