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
      mins: 27,
      total: 0,
      p: 0,
      toVis: toVisit,
      deltaMe: 0,
      deltaEl: 0,
      // log: [],
    },
  ];

  let i = 0;

  let h = 0,
    t = [];

  const maybeSubmit = (opts, curr) => {
    if (!opts.length) {
      const val = curr.total + curr.mins * curr.p;

      if (h < val) {
        h = val;
        console.log(h);
        t.unshift(curr);
      }
    }
  };

  const visited = new Set();
  while (queue.length) {
    const curr = queue.pop();


    if (curr.mins === 0) {
      maybeSubmit([], curr);
      continue;
    }

    const next = {...curr};

    next.mins--;
    next.total += next.p;
    

    if (curr.deltaMe ===0) {
      const item = map.get(next.meTarget);
      // visited.add(item.id);
      next.p+= item.rate;
      
    }

    if (next.deltaEl === 0) {
      const item = map.get(next.elTarget);
      next.p+= item.rate;
    }

    next.deltaMe--;
    next.deltaEl--;

// 
    queue.push(next); 
  

    let opts: typeof queue = [];

    if (curr.deltaMe === 0) {
      const nextOpts = 
          // toVisit
          next.toVis
        .filter(v => !visited.has(v))
        .map((target) => {
        const dis = findDist(next.meTarget, target);
        const toVis = next.toVis.filter(v => v !== target);


        return {
          ...next,
          meTarget: target,
          deltaMe: dis,
          toVis,
          // log: [...curr.log, target]
        }
      });

      // console.log(nextOpts);
      
      // .filter()
      opts.push(...nextOpts)
    } 
    // visited.add(curr.meTarget)
 
    // console.log(curr);
    // throw 'g'
    

    if (curr.deltaEl === 0) {
        if (opts.length === 0) {
          const nextOpts = next.toVis.map((target) => {
            const dis = findDist(next.elTarget, target);
            const toVis = next.toVis.filter(v => v !== target);
    
            return {
              ...next,
              elTarget: target,
              deltaEl: dis,
              toVis,
              // log: [...curr.log, target]
            }
          });
          opts.push(...nextOpts)
        } else {
          opts.forEach((opt) => {
            const nextOpts = opt.toVis.map((target) => {
              const dis = findDist(opt.elTarget, target);
              const toVis = opt.toVis.filter(v => v !== target);
      
              return {
                ...opt,
                elTarget: target,
                deltaEl: dis,
                toVis,
                // log: [...curr.log, target]
              }
            });
            opts.push(...nextOpts)
          })
        }
      
    }

    opts.sort((a, b) => {

      const pota = (a.mins - a.deltaMe) * map.get(a.meTarget).rate
      const potb = (b.mins - b.deltaMe) * map.get(b.meTarget).rate
      return potb - pota;
    });

    //   // console.log(pota, potb);
      

    //   return a.deltaEl - b.deltaEl; //potb - pota;
    //   // const rma = map.get(a.meTarget)
    //   // const rea = map.get(a.elTarget)
    //   // const rmb = map.get(b.meTarget)
    //   // const reb = map.get(b.elTarget)

    //   // const opma = rma.rate / a.deltaMe
    //   // const opmb = rmb.rate / a.deltaMe

    //   // const opea = rea.rate / a.deltaEl
    //   // const opeb = reb.rate / b.deltaEl

    //   // const ca = (opma + opea);
    //   // const cb = (opmb + opeb);
    //   // // const opmb = rmb.rate / a.deltaMe
    //   // return ca - cb;
    // })

    // if (opts.length> 1) {
    //   console.log(opts);

    // }
    
    // opts.sort((b, a) => b.total - a.total);
    queue.push(...opts);


    if (i++ % 1000000 === 0) {
      console.log(i, h, t.length, queue.length);
    }
  } 

  
  console.log({ last: t[0], h });
  

  return h;
};

// for wallaby
describe("part 1 tests", () => {
  it("passes for case 1 if exists", () => {
    const case1 = getTestCases()[0];
    if (case1) {
      const actual = solve(case1.input);
      // assert.equal(actual, 1651);
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
