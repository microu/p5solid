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

  run(node: HTMLElement) {
    new p5((pArg) => {
      this.p = pArg;
      const p = pArg as unknown as p5;

      p.setup = () => {
        this.opt.setup(p);
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
