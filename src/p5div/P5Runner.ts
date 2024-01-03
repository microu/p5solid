import p5 from "p5";



export class P5Runner {
  p: p5 | undefined;
  constructor(
    readonly setup: (p: p5) => void,
    readonly draw: (p: p5) => void
  ) {}

  run(node: HTMLElement) {
  
    
      new p5((pArg) => {
      this.p = pArg;
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
