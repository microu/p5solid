import p5 from "p5";
import { P5Runner } from "../p5div/P5Runner";

export function sampleSimpleSquare(
  color: string = "#AAA",
  canvasSize = 256
): P5Runner {
  function setup(p: p5) {
    p.createCanvas(canvasSize, canvasSize);
  }

  function draw(p: p5) {
    p.background("#333");
    p.noStroke();
    p.fill(color);
    p.rect(canvasSize / 4, canvasSize / 4, canvasSize / 2, canvasSize / 2);
  }

  return new P5Runner(setup, draw);
}
