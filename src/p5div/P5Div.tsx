import { Component } from "solid-js";

import p5 from "p5";
import { P5Runner } from "./P5Runner";

export interface IP5Handler {
  setup: (p: p5) => void;
  draw: (p: p5) => void;
}

type TProps = {
  runner: P5Runner;
  initCanvas?: (canvas: HTMLCanvasElement) => void;
  class?: string;
};

export const P5Div: Component<TProps> = (props) => {
  const classes = () => props.class ?? "";

  let divElt: HTMLDivElement | undefined;

  const r = <div ref={divElt} class={classes()}></div>;
  props.runner.run(divElt!, props.initCanvas);
  const canvasElt = divElt!.querySelector("canvas");
  console.log("CANVAS:", canvasElt);
  return r;
};

export default P5Div;
