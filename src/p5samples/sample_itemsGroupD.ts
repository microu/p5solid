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
  const bgcolor = resolveColor("pink-950");
  const nItems = 5;

  // state
  const context = new P5TimeContext();
  let nextAppendChild = 0;

  // group + hooks
  const group = new P5ItemsGroup({ postDraw });
  function postDraw(ig: P5ItemsGroup, _p: p5, ctx: IP5TimeContext) {
    while (group.length < nItems && ctx.t > nextAppendChild) {
      ig.appendChild(createItem(ctx.t));
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

function createItem(t: number) {
  const lineColor =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];
  const x = 28 + Math.random() * 228;
  const cy = new TickableValue(24)
  const ta = t+ 1000 + Math.random()*3000;
  const tb = ta + 1000 + Math.random()*3000;
  const tc = tb + 500 + Math.random()*1000;
  
  cy.addTarget({t: t+ ta, v:256})
  cy.addTarget({t: t+ tb, v:0})
  cy.addTarget({t: t+ tc, v:128})

  return new P5Drawer((p, ctx) => {
    cy.tick(ctx.t)
    p.noFill()
    p.stroke(lineColor)
    p.strokeWeight(2)
    p.line(x, 0, x, 256)

    p.noStroke()
    p.fill(lineColor)
    p.circle(x, cy.value(), 12)

    return "";
  });
}
