const g: any = global;

// hack for running from terminal in a non-wallaby context easily
if (!g.describe) {
	g.describe = () => {};
	g.it = () => {};
}

import { solve } from "./solve";
import { puzzleInput } from "./puzzle-input";

(async () => {
	// console.log('** answer is 1', solve(puzzleInput, 1));
	// console.log('** answer is 2', solve(puzzleInput, 2));
	console.log('** answer is 3', solve(puzzleInput));
})()

