// hack for running from terminal in a non-wallaby context easily
const g: any = global;
if (!g.describe) {
  g.describe = () => {};
  g.it = () => {};
}

import { solve1 } from "../solution/solve1";
import { solve2 } from "../solution/solve2";

process.on("message", (message) => {
  if (message.solve1) {
    const res = solve1(message.solve1);
    process.send({
      solution1: res,
    });
  } else if (message.solve2) {
    const res = solve2(message.solve2);
    process.send({
      solution2: res,
    });
  }
});
