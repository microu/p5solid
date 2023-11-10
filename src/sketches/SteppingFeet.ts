import p5 from "p5";
import { SketchHandlerBase, ISketchDrawable } from "../SketchHandlers";
import { MetaDataStore } from "./metaDataStore";

type TSteppingFeetOptions = {
  background: string;
  colorA: string;
  colorB: string;
  w: number;
  h: number;
  barWidth: number;
  rectWidth: number;
  rectHeight: number;
};

type TSteppingFeetArg = Partial<TSteppingFeetOptions>;

const DEFAULT_STEPPING_FEET_OPTIONS: TSteppingFeetOptions = {
  background: "gray",
  colorA: "black",
  colorB: "white",
  w: 400,
  h: 400,
  barWidth: 8,
  rectWidth: 4, // barWidth
  rectHeight: 1.5, // barWidth
};

class VerticalBars implements ISketchDrawable {
  constructor(private color: string, private width: number) {}
  draw(p: p5) {
    p.noStroke();
    for (let i = 0; i < p.width / this.width; i++) {
      p.fill(this.color);
      if (i % 2 === 0) p.rect(i * this.width, p.height, this.width, -p.height);
    }
    return "";
  }
}

class MovingRect implements ISketchDrawable {
  xspeed: number;
  t0: number | undefined;
  duration: number;
  fadeDuration: number;

  constructor(
    private x: number,
    private y: number,
    private w: number,
    private h: number,
    private color: string
  ) {
    this.xspeed = 0.5 + Math.random() * 1;
    this.fadeDuration = 500 + 8000 * Math.random();
    this.duration = 2 * this.fadeDuration + 3000 + 8000 * Math.random();
  }

  draw(p: p5) {
    let state = "move";

    if (this.t0 == undefined) {
      this.t0 = p.millis();
    }
    const t = p.millis() - this.t0;

    p.noStroke();
    let alpha = "ff";
    if (t < this.fadeDuration) {
      alpha = coefToHexString(t / this.fadeDuration);
      state = "fadein";
    } else if (this.duration - t < this.fadeDuration) {
      state = "fadeout";
      alpha = coefToHexString((this.duration - t) / this.fadeDuration);
      console.log(alpha);
    }
    p.fill(this.color + alpha);
    p.rect(this.x, this.y, this.w, this.h);
    if (this.x + this.w >= p.width || this.x < 0) {
      this.xspeed *= -1;
    }
    this.x += this.xspeed;

    return t < this.duration ? state : "done";
  }
}

function coefToHexString(coef: number): string {
  if (coef < 0) {
    coef = 0;
  } else if (coef >= 1) {
    coef = 0.999999;
  }
  const r = Math.floor(256 * coef).toString(16);
  return r.length > 1 ? r : "0" + r;
}

type TElementMeta = {
  type: string;
  state: string;
};

export function steppingFeet(arg: TSteppingFeetArg = {}): SketchHandlerBase {
  const opt: TSteppingFeetOptions = {
    ...DEFAULT_STEPPING_FEET_OPTIONS,
    ...arg,
  };

  const metaStore = new MetaDataStore<ISketchDrawable, TElementMeta>();

  function createElement(type: string, p: p5): ISketchDrawable {
    if (type == "brickB") {
      return new MovingRect(
        (p.width * Math.random()) / 2,
        p.height * Math.random(),
        opt.rectWidth * opt.barWidth,
        opt.rectHeight * opt.barWidth,
        opt.colorB
      );
    } else if (type == "brickA") {
      return new MovingRect(
        (p.width * Math.random()) / 2,
        p.height * Math.random(),
        opt.rectWidth * opt.barWidth,
        opt.rectHeight * opt.barWidth,
        opt.colorA
      );
    } else if (type == "bars") {
      return new VerticalBars(opt.colorB, opt.barWidth);
    }
    throw new Error(`Unknown element type: ${type}`);
  }

  function setup(p: p5) {
    p.createCanvas(opt.w, opt.h);
    p.frameRate(24);

    metaStore.set(createElement("brickB", p), { type: "brickB", state: "" });
    metaStore.set(createElement("brickB", p), { type: "brickB", state: "" });
    metaStore.set(createElement("brickB", p), { type: "brickB", state: "" });

    metaStore.set(createElement("bars", p), {
      type: "bars",
      state: "",
    });

    metaStore.set(createElement("brickA", p), { type: "brickA", state: "" });
    metaStore.set(createElement("brickA", p), { type: "brickA", state: "" });
    metaStore.set(createElement("brickA", p), { type: "brickA", state: "" });
  }

  function draw(p: p5) {
    if (p.mouseIsPressed) {
      p.background(opt.background);
    } else {
      p.background(opt.colorA);
    }

    for (const layer of ["brickB", "bars", "brickA"]) {
      for (const [elt, meta] of metaStore.iter((_e, m) => m.type == layer)) {
        if (meta.type == "bars" && p.mouseIsPressed) continue;
        const state = elt.draw(p);
        metaStore.set(elt, { type: meta.type, state: state ?? "" });
        if (state == "done") {
          metaStore.delete(elt);
        }
        if (state != meta.state && state == "fadeout" ) {
          const newElt = createElement(meta.type, p);
          metaStore.set(newElt, { type: meta.type, state: "" });
        }
      }
    }
  }
  return new SketchHandlerBase(setup, draw);
}
