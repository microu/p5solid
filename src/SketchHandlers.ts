import p5 from "p5";

export interface ISketchHandler {
  run(node: HTMLElement): void;
}

export type SketchDrawFunc<E = string> = (p: p5,) => E | undefined;

export interface ISketchDrawable<E = string> {
  draw: SketchDrawFunc<E>;
}

export class SketchHandlerBase implements ISketchHandler {
  constructor(
    readonly setup: (p: p5) => void,
    readonly draw: (p: p5) => void
  ) {}

  run(node: HTMLElement) {
    
    console.log("HANDLER RUN")
    new p5((pArg) => {
      const p = pArg as unknown as p5;

      p.setup = () => {
        this.setup(p);
      };

      p.draw = () => {
        this.draw(p);
      };
    }, node);
  }
}
