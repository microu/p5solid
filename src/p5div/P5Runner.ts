import p5 from "p5";

export type TP5RunnerOptions = {
  setup: (p: p5) => void;
  draw: (p: p5) => void;
  mouseClicked?: (p: p5, e?: Object) => void;
};

export class P5Runner {
  p: p5 | undefined;
  private opt: any;
  constructor(opt: TP5RunnerOptions) {
    this.opt = { ...opt };
  }

  run(node: HTMLElement, initCanvas?: (canvas: HTMLCanvasElement) => void) {
    new p5((pArg) => {
      this.p = pArg;
      const p = pArg as unknown as p5;

      p.setup = () => {
        this.opt.setup(p);
        const canvasElt = node.querySelector("canvas");
        if (initCanvas != undefined) {
          initCanvas(canvasElt!);
        }
      };

      p.draw = () => {
        this.opt.draw(p);
      };

      if (this.opt.mouseClicked) {
        p.mouseClicked = (e?: object) => {
          this.opt.mouseClicked(p5, e);
        };
      }
    }, node);
  }
}
