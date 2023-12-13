import { P5Runner } from "@src/p5div/P5Runner";
import { ClockBase, IClock } from "@src/segments/tickables";
import p5 from "p5";
import { resolveColor } from "../twconf";
import {
  InterpolateColorSegment,
  InterpolateNumberSegment,
  MirrorValueSegment,
  RepeatValueSegment,
} from "@src/segments";
import { easeBackOut, easeBounceInOut, easeExpInOut, easeSinInOut } from "d3-ease";

type TDancingCircleOptions = {
  w: number;
  h: number;
  bgcolor: string;
  colora: string;
  colorb: string;
};

const default_TDancingCircleOptions: TDancingCircleOptions = {
  w: 600,
  h: 90,
  bgcolor: "slate-600",
  colora: "yellow-600",
  colorb: "orange-700",
};

function resolveColorOptions(opt: { [key: string]: any }) {
  for (const [k, v] of Object.entries(opt)) {
    if (k.indexOf("color") >= 0) {
      opt[k] = resolveColor(opt[k]);
    }
  }
}

export function dancingCircle(options: Partial<TDancingCircleOptions> = {}) {
  const opt: TDancingCircleOptions = {
    ...default_TDancingCircleOptions,
    ...options,
  };
  resolveColorOptions(opt);

  function setup(p: p5) {
    p.createCanvas(opt.w, opt.h);
    p.frameRate(32);
  }

  const sceneSequence: DrawScene[] = [];
  let sceneIndex = 0;

  sceneSequence.push(scenePulseAndGrow(opt));
  sceneSequence.push(sceneColorChange(opt));
  sceneSequence.push(sceneMove(opt));

  const clock = new ClockBase({ scale: 1 / 1000, t0: 0 });

  function draw(p: p5) {
    clock.tick(p.millis());
    p.background(opt.bgcolor);

    const scene = sceneSequence[sceneIndex];
    const sceneRunning = scene.draw(p, clock);
    if (!sceneRunning) {
      sceneIndex = (sceneIndex + 1) % sceneSequence.length;
      console.log("Scene Index:", sceneIndex);
      sceneSequence[sceneIndex].resetClock();
    }
  }

  return new P5Runner(setup, draw);
}

function scenePulseAndGrow(opt: TDancingCircleOptions) {
  const x0 = opt.w / 2;
  const y0 = opt.h / 2;
  const d0 = (opt.h * 2) / 3;

  const d = new RepeatValueSegment(
    new MirrorValueSegment(
      new InterpolateNumberSegment({ a: 0, va: 6, b: 0.4, vb: d0 })
    )
  );
  const k = new RepeatValueSegment(
    new InterpolateNumberSegment(
      { a: 0, va: 0.1, b: 7, vb: 1 },
      { easing: easeBackOut }
    )
  );

  return new DrawScene((p, clock) => {
    p.noStroke();
    p.fill(opt.colora);
    p.circle(x0, y0, d.v(clock.t) * k.v(clock.t));
    return k.contains(clock.t);
  });
}

function sceneColorChange(opt: TDancingCircleOptions) {
  const x0 = opt.w / 2;
  const y0 = opt.h / 2;
  const d0 = (opt.h * 2) / 3;

  const d = new RepeatValueSegment(
    new MirrorValueSegment(
      new InterpolateNumberSegment({ a: 0, va: d0 * 0.9, b: 0.66, vb: d0 })
    )
  );

  const c = new RepeatValueSegment(
    new MirrorValueSegment(
      new InterpolateColorSegment({
        a: 0,
        va: opt.colora,
        b: 1.1,
        vb: opt.colorb,
      })
    )
  );
  return new DrawScene((p, clock) => {
    p.noStroke();
    p.fill(c.v(clock.t));
    p.circle(x0, y0, d.v(clock.t));
    return clock.t < 6;
  });
}

function sceneMove(opt: TDancingCircleOptions) {
  const x0 = opt.w / 2;
  const y0 = opt.h / 2;
  const d0 = (opt.h * 2) / 3;

  const d = new RepeatValueSegment(
    new MirrorValueSegment(
      new InterpolateNumberSegment(
        { a: 0, va: d0 * 1.1, b: 0.2, vb: d0 },
        { easing: easeSinInOut }
      )
    )
  );

  const x = new RepeatValueSegment(
    new MirrorValueSegment(
      new InterpolateNumberSegment(
        {
          a: 0,
          va: d0,
          b: 1.666,
          vb: opt.w - d0,
        },
        { easing: easeExpInOut }
      )
    )
  );

  return new DrawScene((p, clock) => {
    p.noStroke();
    p.fill(opt.colorb);
    p.circle(x.v(clock.t), y0, d.v(clock.t));
    return clock.t < 8;
  });
}

class DrawScene {
  private clock: ClockBase;

  constructor(private drawFunc: (p: p5, clock: IClock) => boolean) {
    this.clock = new ClockBase();
  }

  draw(p: p5, parentClock: IClock): boolean {
    this.clock.tick(parentClock.t);
    return this.drawFunc(p, this.clock);
  }

  resetClock() {
    this.clock = new ClockBase();
  }
}
