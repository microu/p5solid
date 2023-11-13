import p5 from "p5";
import { Particle } from "./particles";
import { TParticlesContext } from "./particlesTypes";
import { ISketchItem } from "./sketchItems";
import { IContextParams } from "../context/values";

export type CreateParticleFunc = (
  x: number,
  y: number,
  p5: p5,
  ctx: TParticlesContext
) => Particle;

export class ParticleSystemB implements ISketchItem {
  private nextPush: number;
  particles: Particle[];
  x: number;
  y: number;
  private _createParticle: CreateParticleFunc | undefined;

  constructor(
    private x0: number,
    private y0: number,
    createParticle?: CreateParticleFunc
  ) {
    this.particles = [];
    this.nextPush = 0;
    this.x = this.x0;
    this.y = this.y0;
    this._createParticle = createParticle;
  }

  draw(p: p5, ctx?: TParticlesContext, params?: IContextParams): string {
    if (ctx == undefined) {
      throw new Error(`Context needed!`);
    }
    if ("x" in ctx.params) {
      this.x = ctx.params.x;
    }
    if ("y" in ctx.params) {
      this.y = ctx.params.y;
    }

    if (ctx.t >= this.nextPush) {
      const particle = this.createParticle(p, ctx);
      if (particle) this.particles.push(particle);
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

  createParticle(p: p5, ctx: TParticlesContext): Particle | undefined {
    if (this._createParticle) {
      return this._createParticle(this.x, this.y, p, ctx);
    }
    return undefined;
  }
}
