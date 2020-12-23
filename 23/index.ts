const g: any = global;

// hack for running from terminal in a non-wallaby context easily
if (!g.describe) {
	g.describe = () => {};
	g.it = () => {};
}

import { solve } from "./solve";
import { puzzleInput } from "./puzzle-input";

(async () => {
	console.log('answer is ', solve(puzzleInput, 100));
})()

