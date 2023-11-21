import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";
import { resolveColor } from "../twconf";
import { P5ItemsGroup } from "../p5div/P5ItemsGroup";
import { P5DataDrawer, P5Drawer } from "../p5div/P5Drawer";
import { colorChoices01 } from "./colorChoices";
import { IP5Item, IP5TimeContext, P5TimeContext } from "../p5div/P5Items";
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

type TPolygonData = {
  edges: number;
  cx: number;
  cy: number;
  d: number;
  starCoef: number;
  color: string;
};

function createItemC(t0: number) {
  const expiration = t0 + 2000 + 6000 * Math.random();
  const color =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];

  const data: TPolygonData = {
    edges: 3 + Math.floor(Math.random() * 7),
    cx: 32 + Math.random() * 180,
    cy: 32 + Math.random() * 180,
    d: 24 + Math.random() * 48,
    starCoef:  Math.random() > 0.75? 0.2 + Math.random()*0.4: 1,
    color: color,
  };

  console.log("POLY:", data)

  return new P5DataDrawer<TPolygonData>(data, (p, ctx, poly) => {
    p.noStroke();
    p.fill(poly.color);
    p.beginShape();




    if (poly.starCoef >= 0.99) {
      for (let i = 0; i < poly.edges; i += 1) {
        const theta = i * ((p.PI * 2) / poly.edges);
        p.vertex(
          poly.cx + poly.d * p.sin(theta),
          poly.cy + poly.d * p.cos(theta)
        );
      }
    } else {

      for (let i = 0; i < poly.edges; i += 1) {
        const theta = i * ((p.PI * 2) / poly.edges);
        p.vertex(
          poly.cx + poly.d * p.sin(theta),
          poly.cy + poly.d * p.cos(theta)
        );
        p.vertex(
          poly.cx +
            poly.starCoef *
              poly.d *
              p.sin(theta + (p.PI * 2) / (poly.edges * 2)),
          poly.cy +
            poly.starCoef *
              poly.d *
              p.cos(theta + (p.PI * 2) / (poly.edges * 2))
        );
      }
    }
    p.endShape(p.CLOSE);

    return ctx.t > expiration ? "!done" : "";
  });
}

//
//
//
