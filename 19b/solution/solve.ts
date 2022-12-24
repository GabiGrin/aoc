// import { puzzleInput } from "../lib/lib";
import { assert } from "chai";
import { access } from "fs";
import { ListFormat } from "typescript";
import { getTestCases } from "../runtime/lib/get-tests";
import { readInputFile } from "../runtime/lib/input-output-files";
import {
  addRobot,
  BP,
  collect,
  empty,
  isNope,
  nextBuy,
  payForRobot,
  State,
  Type,
} from "./lib";

export const parseInput = (raw: string) => {
  const rows = raw
    .split("\n")
    .map((n) => n.trim())
    .filter((v) => !!v)
    .map((r) => {
      // Blueprint 8: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 19 clay. Each geode robot costs 2 ore and 18 obsidian.

      const [
        _,
        num,
        oreOre,
        clayOre,
        obsidianOre,
        obsidianClay,
        geodeOre,
        geodeObsidian,
      ] = r
        .match(
          /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
        )
        .map(Number);
      return {
        num,
        oreOre,
        clayOre,
        obsidianOre,
        obsidianClay,
        geodeOre,
        geodeObsidian,
      };
    });
  // .map(Number);
  // .map(v => v.split('').map(Number));

  // return gridFromMatix(rows);
  return rows;
};


export const calcQuality = (bp: BP) => {
  let rs: State = { ...empty, ore: 0 };
  let robots: State = { ...empty, ore: 1 };

  
  let max = 0;
  
  
  const payForAll = (rs: State, robots: State) => {
    let newRs = {...rs};
    newRs.ore -= (robots.clay * bp.clayOre) + (robots.ore * bp.oreOre) + (robots.obsidian * bp.obsidianOre) + (robots.geode * bp.geodeOre);
    newRs.clay -= robots.obsidian * bp.obsidianClay;
    newRs.obsidian -= robots.geode * bp.geodeObsidian
    return newRs;
  }

  const calcOpts = (rs: State): State[] => {
    
    const robots = {...empty};
    const opts = [];

    const queue = [{robots, rs}];

    const all = [];

    const viz = new Set();

    while (queue.length) {
      const next = queue.shift();

      all.push(next.robots);

      const opts = nextBuy(bp, next.rs);

      opts.forEach((opt) => {
        const robots = {...empty, [opt]: 1};
        const newRobots = addItems(next.robots, robots)
        const newRs = payForAll(next.rs, newRobots);

        const k = itemKey(newRobots);
        if (!viz.has(k)) {
          queue.push({robots: newRobots, rs: newRs});
          viz.add(k)
        }
      });
      
    }

    return all.reverse();
  }

  // const n = Date.now();
  // const r = calcOpts({...empty, clay: 200, ore: 2000});
  // console.log(Date.now() - n, r.length);
  // throw 'bob';




  let i = 0;


  const visited = new Set();

  const key = (robots, rs, minutes) => {
    return itemKey(robots) + ',' + itemKey(rs) + ',' + minutes;
  }

  const all = [];

  let dismissed = 0;

  const maxPerMinute = new Map();

  const calcValue = (rs: State) => {
    
  }

  const largerOrEqual = (s1: State, s2: State) => {
    if (s1.geode > s2.geode) {
      return 1;
    }
    if (s1.geode < s2.geode) {
      return -1;
    }
    
    if (s1.obsidian > s2.obsidian) {
      return 1;
    }
    if (s1.obsidian < s2.obsidian) {
      return -1
    }

    if (s1.clay === s2.clay) {
      if (s1.ore > s2.ore) {
        return 1
      }
      if(s1.ore < s2.ore) {
        return -1
      }
      return 0;
    }
    if (s1.ore === s2.ore) {
      if (s1.clay > s2.clay) {
        return 1;
      }
      if (s1.clay < s2.clay) {
        return -1
      }
      return 0;
    }

    return 0;
  }

  const round = { rs, robots, minutes: 10 , total: rs };
  const queue = [round];

  while (queue.length) {
    const { rs, robots, minutes, total } = queue.pop();


    console.log(minutes, robots);
    
    if (minutes === 0) {
      all.push({rs, robots, minutes});
      if (rs.geode > max) {
        console.log('found', rs, robots, minutes);
        max = rs.geode;
      }
      continue;
    }

    if (i++ % 10000 === 0) {    
        console.log(maxPerMinute);
      
        console.log({i, minutes, dismissed, l: queue.length, rs, robots});
    }

    if (rs.geode) {
      console.log('woop');
      
    }

    // const currMpm = maxPerMinute.get(minutes) || {...empty};

    const allOpts = calcOpts(rs);
    // const ki = itemKey(robots) + minutes

    allOpts.forEach(opt => {
      const payed = payForAll(rs, opt);
      const collected = collect(payed, robots);      
      const newRobots = addItems(robots, opt)
      const newTotal = addItems(total, robots);
      
      const ki = itemKey(newRobots) + minutes;

      const mpm = maxPerMinute.get(minutes - 1) || empty;

      if (largerOrEqual(mpm, newRobots) === 1) {        
        dismissed++;
        return;
      }

      queue.push({minutes: minutes - 1, rs: collected, robots: newRobots, total: newTotal})
      if (largerOrEqual(newRobots, mpm) === 1)  {
        maxPerMinute.set(minutes - 1, newRobots);
      }
    })
    queue.sort((a, b) => largerOrEqual(a.robots, b.robots)).reverse();

    // console.log(queue[0].robots, queue[0].rs, minutes);
    
  }


  console.log(maxPerMinute);
  

  // console.log(all);
  
  

  return max;
  // return rs.geode;
};

export const solve = (raw: string): any => {
  const input = parseInput(raw);

  return input
    .map((bp) => ({ q: calcQuality(bp), n: bp.num }))
    .reduce((a, b) => {
      return a + b.q * b.n;
    }, 0);
};

// for wallaby
describe("part 1 tests", () => {
  //   it("buying opt", () => {
  //     const case1 = getTestCases()[0];
  //     const bp = parseInput(case1.input)[0];
  //     const curr = { ore: 40, clay: 14, geode: 0, obsidian: 14 };
  //     const opt = { ore: 0, clay: 0, geode: 0, obsidian: 0 };
  //     const op1 = calcBuyingOpts(curr, opt, bp);
  //     // console.log(op1.length);
  //     // console.log(op1);
  //   });
  it("calculates quality level", () => {
    const case1 = getTestCases()[0];
    // const q1 = calcQuality(parseInput(case1.input)[0]);
    // assert.equal(q1, 9);
  });

  it.only("calculates quality level", () => {
    const case1 = getTestCases()[0];
    const q2 = calcQuality(parseInput(case1.input)[0]);
    assert.equal(q2, 9);
  });

  it("passes for case 1 if exists", () => {
    const case1 = getTestCases()[0];
    if (case1) {
      const actual = solve(case1.input);
      assert.equal(actual, case1.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 2 if exists", () => {
    const case2 = getTestCases()[1];
    if (case2) {
      const actual = solve(case2.input);
      assert.equal(actual, case2.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 3 if exists", () => {
    const case3 = getTestCases()[2];
    if (case3) {
      const actual = solve(case3.input);
      assert.equal(actual, case3.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 4 if exists", () => {
    const case4 = getTestCases()[3];
    if (case4) {
      const actual = solve(case4.input);
      assert.equal(actual, case4.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 5 if exists", () => {
    const case5 = getTestCases()[4];
    if (case5) {
      const actual = solve(case5.input);
      assert.equal(actual, case5.expected);
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
