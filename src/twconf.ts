import chroma from "chroma-js";
import tailwindLocalConfig from "../tailwind.config.js";
import { TWConfig } from "@mr-kit/tailwind";

const twconf = new TWConfig(tailwindLocalConfig);

export function resolveColor(c: string): string {
  const cc = twconf.color(c);
  return cc == undefined ? c : cc;
}

export function resolveChromaColor(c: string): chroma.Color {
  return chroma(resolveColor(c));
}

export default twconf;
