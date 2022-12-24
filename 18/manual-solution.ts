import { getTestCases } from "./runtime/lib/get-tests";
import { readInputFile } from "./runtime/lib/input-output-files";

// Usage: npm run solve
// Useful with long running inputs, or any other when the runtime / wallaby

// hack for running from terminal in a non-wallaby context easily
const g: any = global;
if (!g.describe) {
	g.describe = () => {};
	g.it = () => {};
}

import { solve } from "./solution/solve";

(async () => {
	// console.log('answer is ', solve(getTestCases()[1].input));
	console.log('answer is ', solve(readInputFile()));
})()