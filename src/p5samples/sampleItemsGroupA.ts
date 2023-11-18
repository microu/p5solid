import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";

export function sampleSimpleSquare(color: string = "#AAA"): P5Runner {
  function setup(p: p5) {
    p.createCanvas(256, 256);
  }

  function draw(p: p5) {
    p.background("#333");
    p.noStroke();
    p.fill(color);
    p.rect(64, 64, 128, 128);
  }

  return new P5Runner(setup, draw);
}
