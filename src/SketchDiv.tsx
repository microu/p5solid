import { Component } from "solid-js";
import { ISketchHandler } from "./SketchHandlers";

type TProps = {
  handler: ISketchHandler;
  class?: string;
};

const SketchDiv: Component<TProps> = (props) => {
  const classes = () => props.class ?? "";

  let divElt: HTMLDivElement | undefined;

  const r = <div ref={divElt} class={classes()}></div>;

  props.handler.run(divElt!);

  return r;
};

export default SketchDiv;
