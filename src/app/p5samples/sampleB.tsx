import p5 from "p5";
import { resolveColor } from "../twconf";
import { P5Runner } from "../../p5div/P5Runner";

type TLine = {
  color: string;
  x1: number;
  x2: number;
  v: number;
  bias: number;
};

export const sampleB = () => {

  // parameters
  const bgcolor = resolveColor("slate-800");

  //state
  let t0 = 0;
  const lines: TLine[] = [];

  function draw(p: p5) {
    p.background(bgcolor);
    const dropLines: number[] = [];
    // animate and draw
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      line.x1 += line.v * (-0.5 + line.bias + Math.random());
      line.x2 += line.v* (-0.5 + line.bias + Math.random());
      p.stroke(line.color);
      p.strokeWeight(1.2)
      p.line(line.x1, 0, line.x2, p.height);
      if (
        (line.x1 < 0 || line.x1 > p.width) &&
        (line.x2 < 0 || line.x2 > p.width)
      ) {
        dropLines.push(i);
      }
    }
    // cleanup (drop)
    for (let i = dropLines.length - 1; i >= 0; i -= 1) {
      lines.splice(dropLines[i], 1);
    }
    // add lines
    while (lines.length < 16) {
      lines.push(createLine());
    }
  }

  function setup(p: p5) {
    p.createCanvas(800, 60);
    p.frameRate(32);
    t0 = p.millis();
    lines.push(createLine(), createLine(), createLine());
  }

  const lineColors = [
    resolveColor("stone-200"),
    resolveColor("stone-400"),
    resolveColor("zinc-100"),
    resolveColor("zinc-300"),
    resolveColor("orange-100"),
    resolveColor("amber-200"),
    resolveColor("pink-100"),
    resolveColor("emerald-100"),
    resolveColor("purple-100"),
  ];
  
  function createLine(): TLine {
    const color = lineColors[Math.floor(Math.random() * lineColors.length)];
    const x1 = 100 + Math.random() * 600;
    const x2 = x1 - 100 + Math.random() * 200;
    const v = 3 + Math.random() * 6;
    const bias = -0.2 + Math.random() * 0.4;

    return {
      color,
      x1,
      x2,
      v,
      bias,
    };
  }

  return new P5Runner(setup, draw);
};
