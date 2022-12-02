// hack for running from terminal in a non-wallaby context easily
const g: any = global;
if (!g.describe) {
  g.describe = () => {};
  g.it = () => {};
}

import { solve } from "../../../solution/solve";

process.on("message", (message) => {
  if (message.solve) {
    try {
      const res = solve(message.solve);
      process.send({
        solution: res,
      });
    } catch (e) {
      process.send({
        error: e
      })
    }
  }
});
