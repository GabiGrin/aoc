import { existsSync, fstatSync, writeFileSync } from "fs";
import {
  delay,
  getAocConfig,
  guessCurrentPart,
  isInputUnlocked,
  notify,
  readInput,
  runFixtures,
  solveForked,
} from ".";
import * as path from "path";
3;
import chokidar from "chokidar";
import assert from "assert";
import { AocClient } from 'advent-of-code-client';

// import { attemptSubmitAnswer, downloadInput } from "./aoc-api";



const RETRY_TIME = 10000;
const config = getAocConfig();
const session = process.env.AOC_SESSION;
assert(!!session, `AOC_SESSION env variable missing`);

const client = new AocClient({year: config.year, day: config.day, token: session})

export const initInputDownloader = async () => {
  const input = readInput();
  if (input) {
    notify(`Input file already exists! not downloading`);
  } else {
    const attempt = async () => {
      if (isInputUnlocked(config)) {
        try {
          const input = await client.getInput();
          const inputPath = path.resolve(`${__dirname}/../input.txt`);
          writeFileSync(inputPath, input, "utf-8");
          notify(`Input downloaded and copied to input.txt!`);
          return true;
        } catch (e) {
          console.error(e);
          notify(`Error downloading input - ${e}, trying again in 10 seconds`);
          return false;
        }
      } else {
        notify(`Input is not ready yet, trying again in 10 seconds`);
        return false;
      }
    };

    let success = await attempt();
    while (!success) {
      await delay(RETRY_TIME);
      success = await attempt();
    }
  }
};

export const initTestSolver = async () => {
  let cancelForkedSolver: any = null;

  const trySolvingFixtures = async () => {
    const currPart = guessCurrentPart();
    notify(`Running part ${currPart} tests..`);

    if (cancelForkedSolver) {
      notify("Cancelling previous run");
      cancelForkedSolver();
    }

    const { resultsPromise, cancelAll } = runFixtures(currPart);
    cancelForkedSolver = cancelAll;
    const results = await resultsPromise;
    const passing = results.filter((r) => r.success).length;

    cancelForkedSolver = null;

    const total = results.length;

    const emojis = results.map((r) => (r.success ? "✅" : "❌")).join("");

    if (!total) {
      notify(`No valid fixtures found yet. Not running`);
    } else if (passing === total) {
      notify(`${emojis} SUCCESS -All ${total} tests are passing!`);

      notify(`Going to solve main input.txt`);

      const input = readInput();

      const { promise, cancel } = solveForked(input, currPart);
      cancelForkedSolver = cancel;
      const solution = await promise;
      console.log(`Got solution`, solution);
      
      const outputPath = path.resolve(__dirname, `../output${currPart}.txt`);
      writeFileSync(outputPath, `${solution}`, 'utf-8');
      notify(`⭐️ Solution ready in output${currPart}.txt!`);

      if (!hasSubmitAttempt(currPart)) {
        notify(`No submit attempt found, going to submit!`);
        logSubmitAttempt(currPart, solution);

        const success = await client.submit(currPart, solution);
        if (success) {
            notify(`🙌🏻⭐️🙌🏻⭐️🙌🏻⭐️ Completed!`)
        } else {
            console.log(success);
            notify(`Doesn't look right. See console for full response`);
        }
      } else {
          notify(`Found existing previous submission attempt, will not submit automatically`);
      }
    } else {
      const failingCases = results.filter((r) => !r.success).map((r) => r.n);

      notify(
        `${emojis} FAIL P${currPart} - ${
          failingCases.length
        } failed - cases [${failingCases.join(
          ", "
        )}] out of ${total}. Try again`
      );
    }
  };
  // whenever a fixture or solution runs, a solution attempt will be made
  await trySolvingFixtures();
  chokidar
    .watch(["part1-tests", "part2-tests", "solution"], {
      ignoreInitial: true,
    })
    .on("all", async (event, path) => {
      await trySolvingFixtures();
    });
};

const hasSubmitAttempt = (part: 1 | 2) => {
    const p = path.resolve(__dirname, `../.part${part}-submission`);
    return existsSync(p);
}

const logSubmitAttempt = (part: 1 | 2, value: string) => {
    const p = path.resolve(__dirname, `../.part${part}-submission`);
    const data = `Solution attempt ${new Date().toLocaleTimeString()}\n${value}`;
    writeFileSync(p, data, 'utf-8');
}
