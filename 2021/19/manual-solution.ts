import { readFileSync } from "fs";
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
	const now = Date.now();
	console.log('answer is ', solve(readInputFile()));
	// console.log('answer is ', solve(readFileSync('./inputtest.txt', 'utf-8')));
	console.log('Time', Date.now() - now);
	
})()