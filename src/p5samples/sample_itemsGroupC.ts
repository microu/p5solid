import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";
import { resolveColor } from "../twconf";
import { P5ItemsGroup } from "../p5div/P5ItemsGroup";
import {P5Drawer } from "../p5div/P5Drawer";
import { colorChoices01 } from "./colorChoices";
import { IP5TimeContext, P5TimeContext } from "../p5div/P5Items";
import { ITimelinePoint } from "../timeline";
import { TimelinePointSequence } from "../timeline/TimelinePointSequence";
import chroma from "chroma-js";
export function sampleItemsGroupC(): P5Runner {
  // parameters
  const bgcolor = resolveColor("pink-950");
  const nItems = 9;

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

type TPolygonTLP = TPolygonData & ITimelinePoint;

function createItemC(t0: number) {
  const expiration = t0 + 2000 + 6000 * Math.random();
  const color1 =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];
  const color2 =
    colorChoices01[Math.floor(Math.random() * colorChoices01.length)];

  const data: TPolygonData = {
    edges: 3 + Math.floor(Math.random() * 7),
    cx: 32 + Math.random() * 180,
    cy: 32 + Math.random() * 180,
    d: 24 + Math.random() * 48,
    starCoef: Math.random() > 0.75 ? 0.2 + Math.random() * 0.4 : 1,
    color: color1,
  };

  const tlp0: TPolygonTLP = { ...data, t: t0, name: "a", d: 4 };
  const tlp1: TPolygonTLP = { ...data, t: t0 + 1000, name: "b" };
  const tlp2: TPolygonTLP = {
    ...data,
    t: expiration,
    name: "c",
    color: color2,
  };
  const tlp3: TPolygonTLP = {
    ...data,
    t: expiration + 1000,
    name: "d",
    d: data.d /2,
    color: color2 + "00",
  };

  const tseq = new TimelinePointSequence([tlp0, tlp1, tlp2, tlp3]);

  return new P5Drawer((p, ctx) => {
    // handle sequence => poly
    const [a, b, k] = tseq.interval(ctx.t);

    if (a == undefined) {
      return "";
    } else if (b == undefined) {
      return "!done";
    }
    const poly: TPolygonData = {
      edges: a.edges,
      cx: a.cx + k * (b.cx - a.cx),
      cy: a.cy + k * (b.cy - a.cy),
      d: a.d + k * (b.d - a.d),
      starCoef: a.starCoef + k * (b.starCoef - a.starCoef),
      color: chroma.mix(a.color, b.color, k).hex(),
    };

    // draw poly
    console.log("POLY:", poly);
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

    return "";
  });
}

//
//
//
