import { existsSync, writeFileSync } from "fs";

import * as path from "path";
import chokidar from "chokidar";
import { createAocClient, PuzzlePart } from "./lib/aoc-api";
import { forkedSolve } from "./lib/forked-solve";
import { getPuzzleConfig } from "./lib/puzzle-config";
import { notify } from "./lib/notifier";
import { runTests } from "./lib/run-tests";
import { readInputFile, writeOutputFile } from "./lib/input-output-files";
import { setLastState } from "./lib/last-state";
import { resetTestsOutputs } from "./lib/reset-tests-outputs";
import { backupPart1Solution } from "./lib/backup-part1-solution";
import { debounce } from "./lib/debouce";

const config = getPuzzleConfig();

const client = createAocClient(config);

export const initSolver = async (initialPart: PuzzlePart) => {
  return new Promise<void>(async (resolve) => {
    let cancelForkedSolver: any = null;

    let currentPart = initialPart;

    setLastState(initialPart);

    client.openRiddleInBrowser();

    const trySolvingTestCases = async () => {
      notify(`Running part ${currentPart} tests..`);

      if (cancelForkedSolver) {
        notify("Cancelling previous run");
        cancelForkedSolver();
      }

      const { resultsPromise, cancelAll } = runTests();
      cancelForkedSolver = cancelAll;
      const results = await resultsPromise;
      const passing = results.filter((r) => r.success).length;

      cancelForkedSolver = null;

      const total = results.length;

      const emojis = results.map((r) => (r.success ? "✅" : "❌")).join("");

      if (!total) {
        notify(`No valid fixtures found yet. Not running`);
      } else if (passing === total) {
        notify(`${emojis} SUCCESS! All ${total} test(s) are passing!`);

        notify(`Going to solve main input.txt`);

        const input = readInputFile();

        const { promise, cancel } = forkedSolve(input);
        cancelForkedSolver = cancel;
        const solution = await promise;
        console.log(`Got solution`, solution);
        writeOutputFile(currentPart, `${solution}`);
        notify(`⭐️ Solution ready in output-pt${currentPart}.txt!`);

        if (!hasSubmitAttempt(currentPart)) {
          notify(`No submit attempt found, going to submit!`);
          logSubmitAttempt(currentPart, solution);

          const success = await client.submitAnswer(currentPart, solution);
          if (success) {
            if (currentPart === '2') {
              notify(`✅⭐️⭐️ Part 2 Completed! You rock! You may safely resume your life now`);
              resolve();
            } else {
              resetTestsOutputs();
              backupPart1Solution();
              notify(`✅⭐️ Part 1 Completed! Tests reset and solution backed-up. Opening browser! Good luck on next part!`);
              currentPart = '2';
              setLastState(currentPart)
              client.openRiddleInBrowser();
            }

          } else {
            notify(`😞❌ Nope, not it. Doesn't look right. Auto submission will stop working. To revive it delete relevant submission file`);
          }
        } else {
          notify(
            `Found existing previous submission attempt, will not submit automatically. Use output-pt${currentPart}.txt for your answer`
          );
        }
      } else {
        const failingCases = results.filter((r) => !r.success).map((r) => r.n);

        notify(
          `${emojis} FAIL P${currentPart} - ${
            failingCases.length
          } failed - cases [${failingCases.join(
            ", "
          )}] out of ${total}. Try again`
        );
      }
    };
    // whenever a fixture or solution runs, a solution attempt will be made
    await trySolvingTestCases();

    const debouncedTrySolvingTestCases = debounce(trySolvingTestCases, 200);

    chokidar
      .watch(["tests", "solution"], {
        ignoreInitial: true,
      })
      .on("all", async () => {
        await debouncedTrySolvingTestCases();
      });
  });
};

const hasSubmitAttempt = (part: PuzzlePart) => {
  const p = path.resolve(__dirname, `../.part${part}-submission`);
  return existsSync(p);
};

const logSubmitAttempt = (part: PuzzlePart, value: string) => {
  const p = path.resolve(__dirname, `../.part${part}-submission`);
  const data = `Solution attempt ${new Date().toLocaleTimeString()}\n${value}`;
  writeFileSync(p, data, "utf-8");
};
