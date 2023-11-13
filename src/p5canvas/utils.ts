export function coefToHexString(coef: number): string {
  if (coef < 0) {
    coef = 0;
  } else if (coef >= 1) {
    coef = 0.999999;
  }
  const r = Math.floor(256 * coef).toString(16);
  return r.length > 1 ? r : "0" + r;
}
