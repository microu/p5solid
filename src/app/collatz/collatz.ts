export function collatz(n: number): number {
  return n % 2 == 0 ? n / 2 : 3 * n + 1;
}

export function collatzSequence(n: number): number[] {
    const r = [n];
    while (n >1)  {
        n = collatz(n)
        r.push(n)
    }

    return r;
}
  