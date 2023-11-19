import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";
import { resolveColor } from "../twconf";
import { IP5TimeContext, P5TimeContext } from "../p5div/P5Items";
import { P5ItemsGroup } from "../p5div/P5ItemsGroup";
import { colorChoices01 } from "./colorChoices";
import { P5DataDrawer, P5Drawer } from "../p5div/P5Drawer";
import chroma from "chroma-js";

export function sampleItemsGroupA(): P5Runner {
  // params
  const bgcolor = resolveColor("slate-900");
  const nCircles = 9;

  // state
  const context = new P5TimeContext();

  // hooks
  function postDraw(ig: P5ItemsGroup, p: p5, ctx: IP5TimeContext) {
    while (group.length < nCircles) {
      ig.appendChild(createItem(ig, ctx.t + 1000 + Math.random() * 3000));
    }
    for (const child of ig) {
      const c = (child as P5DataDrawer<TCircle>).data;
      p.noFill()
      p.stroke(resolveColor("red-600"))
      p.strokeWeight(0.5)
      p.rect(c.x - c.d / 2, c.y - c.d / 2, c.d, c.d);
    }
  }

  // group

  const group = new P5ItemsGroup({ postDraw });

  function setup(p: p5) {
    p.createCanvas(256, 256);
  }

  function draw(p: p5) {
    context.draw(p);
    p.background(bgcolor);
    p.frameRate(32);
    group.draw(p, context);
  }

  type TCircle = { x: number; y: number; d: number };

  const lastCircles: TCircle[] = [];
  let nextCircleIndex = 0;

  function pushCircle(c: TCircle) {
    if (lastCircles.length < nCircles) {
      lastCircles.push(c);
    } else {
      lastCircles[nextCircleIndex] = c;
    }
    nextCircleIndex = (nextCircleIndex + 1) % nCircles;
  }

  function findCircle(group: P5ItemsGroup, n: number = 10): TCircle {
    const canditates: TCircle[] = [];
    let bestScore = -1;
    let bestIndex = -1;

    for (let i = 0; i < n; i += 1) {
      const c = createCircle();
      const score = circleScore(group, c);
      if (bestIndex < 0 || score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
      canditates.push(c);
      console.log("BS:", bestScore, bestIndex);
    }
    pushCircle(canditates[bestIndex]);
    return canditates[bestIndex];
  }

  function circleScore(group: P5ItemsGroup, c: TCircle): number {
    let score = 1_000_000;
    for (const child of group) {
      const activeCircle = (child as P5DataDrawer<TCircle>).data;
      const distance = Math.sqrt((activeCircle.x - c.x) ** 2 + (activeCircle.y - c.y) ** 2);
      const cscore = distance - (activeCircle.d + c.d) / 2 + Math.sqrt(c.d) * 3;
      score = Math.min(score, cscore);
    }
    return score;
  }

  function createCircle(): TCircle {
    let x = 24 + Math.random() * 200;
    let y = 24 + Math.random() * 200;
    let d = 24 + Math.random() * 100;
    return { x, y, d };
  }

  function createItem(group: P5ItemsGroup, expiration: number) {
    const c = findCircle(group, 16);
    let color =
      colorChoices01[Math.floor(Math.random() * colorChoices01.length)];
    let strokeColor = color;
    if (chroma.distance(strokeColor, "white") > chroma.distance(strokeColor, "black")) {
      strokeColor = chroma(strokeColor).brighten(1).hex()
    } else {
      strokeColor = chroma(strokeColor).darken(1).hex()
    }
    

    return new P5DataDrawer<TCircle>(c, (p, ctx, dc) => {
      p.stroke(strokeColor);
      p.strokeWeight(2)
      p.fill(color);
      p.circle(dc.x, dc.y, dc.d);

      dc.x += ((Math.random() - 0.5) * 30 * ctx.dt) / 1000;
      dc.y += ((Math.random() - 0.5) * 15 * ctx.dt) / 1000;

      return ctx.t > expiration ? "!done" : "";
    });
  }

  return new P5Runner(setup, draw);
}
