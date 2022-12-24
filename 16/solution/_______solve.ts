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

function getItemPairs(items) {
  const pairs = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]]);
    }
  }

  return pairs;
}

export const solve = (raw: string): any => {
  const input = parseInput(raw);

  const map = new Map(input.map((item) => [item.id, item]));

  const toVisit = input.filter((i) => i.rate).map((i) => i.id);

  const cache = new Map();

  const findDist = (from, to) => {
    if (cache.has(from + to)) {
      return cache.get(from + to);
    }

    const queue = [{ id: from, d: 0 }];
    const viz = new Set<string>();

    while (queue.length) {
      const next = queue.shift();

      if (next.id === to) {
        cache.set(from + to, next.d);
        return next.d;
      }

      viz.add(next.id);

      const leadsTo = map
        .get(next.id)
        .leads.filter((id) => !viz.has(id))
        .map((id) => ({ id, d: next.d + 1 }));

      queue.push(...leadsTo);
    }
  };

  let queue = [
    {
      meTarget: "AA",
      elTarget: "AA",
      mins: 26,
      total: 0,
      p: 0,
      toVis: toVisit,
      deltaMe: -1,
      deltaEl: -1,
      log: []
    },
  ];

  let i = 0;

  let h = 0,
  t = [];

  const maybeSubmit = (opts, curr) => {
    if (!opts.length) {
      const val = curr.total  + curr.mins * curr.p;
      
      if (h < val) {
        h = val;
        console.log(curr);
        t.unshift(curr);
      }
    }
  }

  while (queue.length) {
    const curr = queue.pop();

    if (curr.mins === 0) {
        const val = curr.total;
        
        if (h < val) {
          h = val;
          console.log(curr);
          t.unshift(curr);
        }
        continue;
    }

    if (curr.deltaEl === 0 && curr.deltaMe === 0) {
      // both opening
      const meItem = map.get(curr.meTarget);
      const elItem = map.get(curr.elTarget);
      console.log('both', meItem.rate, elItem.rate);
      
      queue.push({
        ...curr,
        deltaMe: curr.deltaMe - 1,
        deltaEl: curr.deltaEl - 1,
        mins: curr.mins - 1,
        total: curr.total + curr.p,
        p: curr.p + meItem.rate + elItem.rate,
        log: [...curr.log, curr.meTarget, curr.elTarget]
      });
    } else if (curr.deltaEl === -1 && curr.deltaMe === -1) {
      // both need more options
      
      const opts = getItemPairs(curr.toVis)
        .map((pair) => {
          const [me, el] = pair;
          const newVis = curr.toVis.filter((p) => p !== me && p !== el);
          const disMe = findDist(curr.meTarget, me);
          const disEl = findDist(curr.elTarget, el);
            return {
              ...curr,
              deltaMe: disMe,
              deltaEl: disEl,
              meTarget: me,
              elTarget: el,
              // dis: (disMe + disEl) / 2,
              toVis: newVis
            };
        });

        queue.push(...opts);

        maybeSubmit(opts, curr);
      
    } else if (curr.deltaEl > 0 && curr.deltaMe > 0) {
      // both walking
      queue.push({
        ...curr,
        deltaMe: curr.deltaMe - 1,
        deltaEl: curr.deltaEl - 1,
        mins: curr.mins - 1,
        total: curr.total + curr.p,
      });
    } else if (curr.deltaEl > 0 && curr.deltaMe === 0) {
      // el is walking and me is opening
      const meItem = map.get(curr.meTarget);
      queue.push({
        ...curr,
        deltaMe: curr.deltaMe - 1,
        deltaEl: curr.deltaEl - 1,
        mins: curr.mins - 1,
        total: curr.total + curr.p,
        p: curr.p + meItem.rate,
        log: [...curr.log, curr.meTarget]
      });
      

    } else if (curr.deltaMe === -1 && curr.toVis.length) {
      // me needs more opts

    
          const opts = curr.toVis.map((target) => {
            const newVis = curr.toVis.filter((p) => p !== target);
            const disMe = findDist(curr.meTarget, target);
            return {
              ...curr,
              deltaMe: disMe,
              meTarget: target,
              // dis: disMe,
              toVis: newVis,
            }
          });
          queue.push(...opts);
          maybeSubmit(opts, curr);
      


    } else if (curr.deltaEl === -1 && curr.toVis.length) {
      // el needs more opts
      const opts = curr.toVis.map((target) => {
        const newVis = curr.toVis.filter((p) => p !== target);
        const disEl = findDist(curr.elTarget, target);
        return {
          ...curr,
          deltaEl: disEl,
          elTarget: target,
          // dis: disEl,
          toVis: newVis,
        }
      });

      queue.push(...opts);
      maybeSubmit(opts, curr);
      
    } else if (curr.deltaEl ===0 && curr.deltaMe > 0) {
      // one opening
      const elItem = map.get(curr.elTarget);
      queue.push({
        ...curr,
        deltaMe: curr.deltaMe - 1,
        deltaEl: curr.deltaEl - 1,
        mins: curr.mins - 1,
        total: curr.total + curr.p,
        p: curr.p + elItem.rate,
        log: [...curr.log, curr.elTarget]
      });
    } else if (curr.deltaEl > 0 && curr.deltaMe === 0) {
      // one opening
      // both opening
      const meItem = map.get(curr.meTarget);
      queue.push({
        ...curr,
        deltaMe: curr.deltaMe - 1,
        deltaEl: curr.deltaEl - 1,
        mins: curr.mins - 1,
        total: curr.total + curr.p,
        p: curr.p + meItem.rate,
        log: [...curr.log, curr.meTarget]
      });

    } else {
      throw 'bob'
    }



    // if (curr.deltaMe > 0) {
    //   // just move
    //   queue.push({
    //     ...curr,
    //     deltaMe: curr.deltaMe - 1,
    //     mins: curr.mins - 1,
    //     total: curr.total + curr.p,
    //   });
    // } else if (curr.deltaMe === 0) {
    //   // open faucet
    //   const meItem = map.get(curr.meTarget);
    //   queue.push({
    //     ...curr,
    //     deltaMe: curr.deltaMe - 1,
    //     mins: curr.mins - 1,
    //     total: curr.total + curr.p,
    //     p: curr.p + meItem.rate
    //   });

    // } else {

    //   const opts = curr.toVis
    //     .map((toVis) => {
    //       const newVis = curr.toVis.filter((p) => p !== toVis);
    //       const disMe = findDist(curr.meTarget, toVis);
    //         return {
    //           ...curr,
    //           deltaMe: disMe,
    //           meTarget: toVis,
    //           dis: disMe,
    //           toVis: newVis,
    //         };
    //     })
    //     .filter((item) => item.mins >= 0)
    //     .sort((a, b) => {
    //       return a.dis - b.dis;
    //     });

      

    // }

    i++;
    if (i > 3) {
      // throw 'bob'
    }
    if (i % 1000000 === 0) {
      console.log(i, h, t.length, queue.length);
    }
  }

  console.log({last: t[0], h});
  


  // console.log(h);
  return h;

  // return highest;

  // return totals.length;
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
