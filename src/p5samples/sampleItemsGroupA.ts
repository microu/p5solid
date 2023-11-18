import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";
import { resolveColor } from "../twconf";
import { IP5Item, IP5TimeContext, P5TimeContext } from "../p5div/P5Items";
import { P5ItemsGroup } from "../p5div/P5ItemsGroup";
import { P5ItemUpdater } from "../p5div/P5ItemUpdater";
import { CircleItem } from "./circleItem";
import { colorChoices01 } from "./colorChoices";

export function sampleItemsGroupA(): P5Runner {
  // params
  const bgcolor = resolveColor("slate-900");

  // state
  const context = new P5TimeContext();

  // hooks
  function postDraw(ig: P5ItemsGroup, p: p5, ctx: IP5TimeContext) {
    while (group.length < 4) {
      ig.appendChild(createItem(ctx.t + 1500 + Math.random()*1500));
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
    group.draw(p, context);
  }

  function createItem(expiration: number) {
    return new P5ItemUpdater<P5TimeContext, CircleItem>(
      new CircleItem(
        48 + Math.random() * 160,
        48 + Math.random() * 160,
        24 + Math.random() * 64,
        colorChoices01[Math.floor(Math.random() * colorChoices01.length)]
      ),
      (ctx, item) => {
        item.x += (Math.random() - 0.5) * 50 * ctx.dt/ 1000;
        if (ctx.t > expiration) {
          item.state = "!done";
        }
      }
    );
  }

  return new P5Runner(setup, draw);
}
