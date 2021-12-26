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
	// const ans = solve(getTestCases()[0].input);
	// console.log('ans', ans);
	console.log('answer is ', solve(readInputFile()));
	
	// if (ans == getTestCases()[0].expected) {
	// 	console.log('CORRECT')
	// } else {
	// 	console.log('wrong');
		
	// }
	
})()