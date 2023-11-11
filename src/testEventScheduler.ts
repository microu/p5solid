import { EventScheduler } from "./sketches/EventScheduler";

type TEvent = {
  t: number;
  v: string;
};

const scheduler = new EventScheduler<TEvent>();

scheduler.add({ t: 44, v: "D" });
scheduler.add({ t: 44, v: "DD" });
scheduler.add({ t: 11, v: "A" });
scheduler.add({ t: 11, v: "AA" });
scheduler.add({ t: 22, v: "B" });
scheduler.add({ t: 33, v: "C" });

for (let t = 0; t < 100; t += 15) {
  console.log(`- t=${t}:`, scheduler.moveClock(t));
}
console.log(scheduler.length);

