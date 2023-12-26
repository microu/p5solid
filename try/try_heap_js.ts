import Heap from "heap-js";

type TEvent = { t: number; name: string };

const h = new Heap<TEvent>((a, b) => a.t - b.t);

const aCode = "a".charCodeAt(0);

for (let i = 0; i < 100; i += 1) {
  const charIndex = Math.floor(Math.random() * 26);
  const char = String.fromCharCode(aCode + charIndex);
  h.push({ t: charIndex + Math.random(), name: `${char}${i}` });
}

while (h.length > 0) {
  console.log(`- ${h.pop()}`);
}
