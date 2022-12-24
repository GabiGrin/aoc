import { getTestCases } from "./runtime/lib/get-tests";
import { readInputFile } from "./runtime/lib/input-output-files";
import { parseInput } from "./solution/parse";

// Usage: npm run solve
// Useful with long running inputs, or any other when the runtime / wallaby

// hack for running from terminal in a non-wallaby context easily
const g: any = global;
if (!g.describe) {
	g.describe = () => {};
	g.it = () => {};
}

import { calc, solve } from "./solution/solve";

(async () => {
	const test = getTestCases()[0];

	const testInput = parseInput(test.input);
	const realInput = parseInput(readInputFile());

	
	// console.log('bp 1 from test', calc(testInput[0], 24), 'expected 9');
	// console.log('bp 2 from test', calc(testInput[1], 24), 'expected 12');

	// console.log('bp 2 from real', calc(realInput[1], 24), 'expected 2');
	// console.log('bp 3 from real', calc(realInput[2], 24), 'expected 3');
	// console.log('bp 18 from real', calc(realInput[17], 24), 'expected 1');

	// console.log('bp 1 from test - 32', calc(testInput[0], 32), 'expected 56');
	// console.log('bp 1 from test - 32', calc(testInput[0], 32), 'expected 56');

	console.log('answer is test', solve(test.input, 32));

	console.log('answer is ', solve(readInputFile(), 32));
})()