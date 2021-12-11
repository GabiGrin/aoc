import { initInputDownloader } from "./runtime/init-input-downloader";
import { createAocClient } from "./runtime/lib/aoc-api";
import { backupPart1Solution } from "./runtime/lib/backup-part1-solution";
import { getLastState, setLastState } from "./runtime/lib/last-state";
import { notify } from "./runtime/lib/notifier";
import { getPuzzleConfig } from "./runtime/lib/puzzle-config";
import { resetTests } from "./runtime/lib/reset-tests";
import { initSolver } from "./runtime/runner";

const config = getPuzzleConfig();

const client = createAocClient(config);

notify(`Starting AOC Solver for day ${config.day} of year ${config.year}. Good luck!`);
initInputDownloader(client)
    .then(async () => {
        notify(`Input is ready on "input.txt"`);
        
        const state = await client.currentPart();
        
        if (state === 'done') {
            notify(`Looks like you have completed day ${config.day} of ${config.year}! Ba-bye now`)
            process.exit(0);
        }
        const lastState = getLastState();
        
        if (state !== lastState) {
            notify(`Looks like you have solved part 1 outside of the AoC-Runner™, resetting tests!`);
            resetTests();
            backupPart1Solution();
        }
        notify(`Input is taken care of. Starting tests solver on part ${state}. Good luck!`)
        
        setLastState(state);
        
        await initSolver(state);
        process.exit(0);
    });

