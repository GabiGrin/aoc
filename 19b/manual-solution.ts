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

import { calcQuality, parseInput, solve } from "./solution/solve";

(async () => {

	const bp1 = parseInput(getTestCases()[0].input)[1];

	console.log(bp1);

	const quality = calcQuality(bp1);
	console.log(quality);
	
	

	// console.log('answer is ', solve(readInputFile()));
})()