import p5 from "p5";
import { resolveColor } from "../twconf";
import { P5Runner } from "@src/p5div/P5Runner";
export const sampleA = () => {
  // parameters
  const bgcolor = resolveColor("slate-800");
  const colorHueList = [
    "rose",
    "amber",
    "red",
    "orange",
    "purple",
    "blue",
    "emerald",
    "cyan",
  ];
  const squareSize = 40;
  const squareCount = 9;
  // state

  let t0 = 0;
  let colorHueIndex = 0;
  let colorHueChange = -10_000;
  let nextColorHueChange = t0 + 2000;
  let colorHue0 = colorHueList[colorHueIndex];
  let colorHue1 = colorHueList[colorHueIndex];

  function draw(p: p5) {
    const t = p.millis() - t0;
    if (t > nextColorHueChange) {
      colorHueChange = t;
      nextColorHueChange = t + 10_000 + Math.random() * 5000;
      colorHueIndex += 1;
      if (colorHueIndex >= colorHueList.length) colorHueIndex = 0;
      colorHue0 = colorHue1;
      colorHue1 = colorHueList[colorHueIndex];
    }
    const spacing = (p.width - squareCount * squareSize) / (squareCount + 1);
    p.background(bgcolor);
    p.noStroke();
    for (let i = 0; i < squareCount; i += 1) {
      const colorHue = (t - colorHueChange) / 500 > i ? colorHue1 : colorHue0;
      p.fill(resolveColor(`${colorHue}-${100 * (i + 1)}`));
      p.rect(
        spacing + i * (spacing + squareSize),
        (p.height - squareSize) / 2,
        squareSize,
        squareSize
      );
    }
  }

  function setup(p: p5) {
    p.createCanvas(800, 60);
    p.frameRate(32);
    t0 = p.millis();
  }

  return new P5Runner({setup, draw});
};
