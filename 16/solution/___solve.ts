// import { puzzleInput } from "../lib/lib";
import { assert } from "chai";
import { getTestCases } from "../runtime/lib/get-tests";
import { readInputFile } from "../runtime/lib/input-output-files";
import { createGraph } from "./utils/graphs";

const parseInput = (raw: string) => {
  const rows = raw
    .split("\n")
    .map((n) => n.trim())
    .filter((v) => !!v)
    .map((r) => {
      const matches = r.match(
        /^Valve (..) has flow rate=(-?\d+); tunnels? leads? to valves? (.*)/
      );
      if (!matches) {
        console.log(r);
        throw "bbo";
      }
      const [, id, rate, leads] = matches;

      return { id, rate: Number(rate), leads: leads.split(", ") };
    });
  return rows;
};

export const solve = (raw: string): any => {
  const input = parseInput(raw);

  const targets = input.filter(item => item.rate > 0);

  
  
  // return total;
  // return total;
};

// for wallaby
describe("part 1 tests", () => {
  it("passes for case 1 if exists", () => {
    const case1 = getTestCases()[0];
    if (case1) {
      const actual = solve(case1.input);
      assert.equal(actual, case1.expected);
    } else {
      // no test case
    }
  });

  it("passes input if exists", () => {
    // const input = readInputFile();
    // const actual = solve(input);
    // console.log({actual});
  });
});
