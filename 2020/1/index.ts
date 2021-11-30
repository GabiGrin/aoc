const g: any = global;

// hack for running from terminal in a non-wallaby context easily
if (!g.describe) {
	g.describe = () => {};
	g.it = () => {};
}

import { solve as pt1 } from "./pt1";
import { solve as pt2 } from "./pt2";
import { puzzleInput } from "./puzzle-input";

(async () => {
	console.log('answer for 1 is ', pt1(puzzleInput));
	console.log('answer for 2 is ', pt2(puzzleInput));
})()

