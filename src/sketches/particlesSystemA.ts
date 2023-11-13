import p5 from "p5";
import { Particle } from "./particles";
import { TParticlesContext } from "./particlesTypes";
import { ISketchItem } from "./sketchItems";

export class ParticleSystemA implements ISketchItem {
  private nextPush: number;
  particles: Particle[];
  constructor(
    private x: number,
    private y: number,
    private d: number,
    private color: string
  ) {
    this.particles = [];
    this.nextPush = 0;
  }

  draw(p: p5, ctx?: TParticlesContext): string {
    if (ctx == undefined) {
      throw new Error(`Context needed!`);
    }

    if (ctx.t >= this.nextPush) {
      const direction = p.randomGaussian(p.PI, p.PI);
      const vx = 50 * Math.sin(direction);
      const vy = 50 * Math.cos(direction);
      let color = this.color;
      if ("color" in ctx.params) {
        color = ctx.params.color;
      }

      this.particles.push(
        new Particle(
          1 + Math.floor(Math.random() * 3) * 3,
          this.x,
          this.y,
          vx,
          vy,
          // 1 / 3,
          // 1 / 4,
          this.d,
          color,
          (_m, _x, _t, vx, vy) => [-vx, vy * 2]
        )
      );
      this.nextPush = ctx.t + 100 + Math.random() * 100;
    }

    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const particle = this.particles[i];
      if (particle.done()) {
        this.particles.splice(i, 1);
      } else {
        particle.draw(p, ctx);
      }
    }
    return "";
  }
}
