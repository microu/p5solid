import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";
import { resolveColor } from "../twconf";
import { IP5TimeContext, P5TimeContext } from "../p5div/P5Items";
import { P5ItemsGroup } from "../p5div/P5ItemsGroup";
import { colorChoices01 } from "./colorChoices";
import { P5Drawer } from "../p5div/P5Drawer";

export function sampleItemsGroupA(): P5Runner {
  // params
  const bgcolor = resolveColor("slate-900");
  const nCircles = 9;

  // state
  const context = new P5TimeContext();

  // hooks
  function postDraw(ig: P5ItemsGroup, p: p5, ctx: IP5TimeContext) {
    while (group.length < nCircles) {
      ig.appendChild(createItem(ctx.t + 1000 + Math.random() * 3000));
    }
    // for (const c of lastCircles) {
    //   p.noFill()
    //   p.stroke(resolveColor("red-600"))
    //   p.strokeWeight(0.5)
    //   p.rect(c.x - c.d / 2, c.y - c.d / 2, c.d, c.d);
    // }
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
    if (lastCircles.length < nCircles  ) {
      lastCircles.push(c);
    } else {
      lastCircles[nextCircleIndex] = c;
    }
    nextCircleIndex = (nextCircleIndex + 1) % (nCircles);
  }

  function findCircle(n: number = 10): TCircle {
    const canditates: TCircle[] = [];
    let bestScore = -1;
    let bestIndex = -1;
    for (let i = 0; i < n; i += 1) {
      const c = createCircle();
      const score = circleScore(lastCircles, c);
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

  function circleScore(lastCircles: TCircle[], c: TCircle): number {
    let score = 1_000_000;
    for (const lc of lastCircles) {
      const distance = Math.sqrt((lc.x - c.x) ** 2 + (lc.y - c.y) ** 2);
      const cscore = (distance - (lc.d + c.d) / 2 ) + Math.sqrt(c.d) *4;
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

  function createItem(expiration: number) {
    const c = findCircle(16);
    let color =
      colorChoices01[Math.floor(Math.random() * colorChoices01.length)];

    return new P5Drawer((p, ctx) => {
      p.noStroke();
      p.fill(color);
      p.circle(c.x, c.y, c.d);

      c.x += ((Math.random() - 0.5) * 30 * ctx.dt) / 1000;
      c.y += ((Math.random() - 0.5) * 15 * ctx.dt) / 1000;

      return ctx.t > expiration ? "!done" : "";
    });
  }

  return new P5Runner(setup, draw);
}
