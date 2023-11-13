import { TDrawItemContext } from "./sketchItems";

export interface TParticlesContext extends TDrawItemContext {
  gravity: number;
  xforce: number;
  yforce: number;
}
