import { initInputDownloader } from "./runtime/init-input-downloader";
import { createAocClient } from "./runtime/lib/aoc-api";
import { backupPart1Solution } from "./runtime/lib/backup-part1-solution";
import { readInputFile } from "./runtime/lib/input-output-files";
import { getLastState, setLastState } from "./runtime/lib/last-state";
import { notify } from "./runtime/lib/notifier";
import { getPuzzleConfig } from "./runtime/lib/puzzle-config";
import { resetTests } from "./runtime/lib/reset-tests";
import { initSolver } from "./runtime/runner";

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
	console.log('answer is ', solve(readInputFile()));
})()