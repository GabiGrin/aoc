
import { getAocConfig, notify, solveForked } from "./lib";
import { initInputDownloader, initTestSolver } from "./lib/runner";

// // hack for running from terminal in a non-wallaby context easily
// const g: any = global;
// if (!g.describe) {
// 	g.describe = () => {};
// 	g.it = () => {};
// }

// import { solve } from "./solution/solve";
// import { puzzleInput } from "./lib/lib";

// (async () => {
// 	console.log('answer is ', solve(puzzleInput));
// })()

const config = getAocConfig();
notify(`Starting AOC Solver for day ${config.day} of year ${config.year}. Good luck!`);
initInputDownloader()
    .then(() => {
        notify(`Input is taken care of. Starting tests solver. Good luck!`)
        initTestSolver();
    });

