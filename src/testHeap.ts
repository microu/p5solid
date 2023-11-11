import { Heap } from "heap-js";

type TEvent<V> = {
  t: number;
  v: V;
};

const h = new Heap<TEvent<string>>((a, b) => a.t - b.t);
console.log("H:", h.length);
h.push({ t: 33, v: "C" });
h.push({ t: 22, v: "B" });
h.push({ t: 11, v: "A" });
h.push({ t: 22, v: "BB" });
console.log("H:", h.length, h.peek());
console.log("H:", h.length, h.peek());

