// import { puzzleInput } from "../lib/lib";
import { assert } from "chai";
import { getTestCases } from "../runtime/lib/get-tests";
import { readInputFile } from "../runtime/lib/input-output-files";
import { Vector, Line, Plane } from "vanilla-vectors-3d";

const opts = `XXXX
X
Y
Z
XX
XY
XZ
YX
YY
ZY
ZZ
XXX
XXY
XXZ
XYX
XYY
XZZ
YXX
YYY
ZZZ
XXXY
XXYX
XYXX
XYYY`.split("\n");

export const rotate = (v: Vector, opt) => {
  let vec = new Vector(v.x, v.y, v.z);
  
  return opt.split("").reduce((prev, d) => {
    if (d === "X") {
      return prev.rotate("x", 90);
    }
    
    if (d === "Y") {
      return prev.rotate("y", 90);
    }
    
    if (d === "Z") {
      return prev.rotate("z", 90);
    }
    throw 'bob'
  }, vec);
};

const all = opts.map(o => rotate(v, o)).map(s => `${s.x},${s.y},${s.z}`);

const v = new Vector(1, 2, 3);
const s = new Set(all);

console.log(s, s.size);

if (s.size) {
  process.exit(0)
}

// const v = new Vector(1,2,3);
// const allopts = new Set(opts.map(o => rotate(v, o)).map(s => `${s.x},${s.y},${s.z}`));

const parseInput = (raw: string) => {
  const rows = raw.split("\n\n").map((row, i) => {
    const [header, ...rest] = row.split("\n");

    return rest.map((r) => {
      const [x, y, z] = r.split(",").map(Number) as [number, number, number];
      return new Vector(x, y, z);
    });
  });
  // .map(Number);
  // .map(v => v.split('').map(Number));

  // return gridFromMatix(rows);
  return rows;
};


const normalizeScanner = (center: Vector, others: Vector[]): Vector[] => {
  const val = others.map((o) => {
    return o.minus(center);
  });
  return val;
};

const createNormPermutations = (scanner: Vector[]) => {
  const val = scanner.map((c) => {
    return normalizeScanner(c, scanner);
  });
  return val;
};

const scannerRotations = (scanner: Vector[]) => {
  return opts.map((opt) => {
    const newScanner = scanner.map((v) => {
      return rotate(v, opt);
    }) as Vector[];
    // return {perm, scanner: newScanner}
    return newScanner;
  });
};

export const solve = (raw: string): any => {
  const input = parseInput(raw);


  const calcOverlappingInt = (
    s1: Vector[],
    s2: Vector[]
  ): [Vector[], Vector] => {

    // will get scanner s1 and scanner s2, and see if any rotation of s2 will lead to s1 and s2 having 12 or matching beacons
    // if there is, it returns s2 in the right variation, and the diff between s1 and s2
    const normS1 = createNormPermutations(s1);

    for (const perms1 of normS1) {
      const rotationsOfS2 = scannerRotations(s2);

      for (const s2rotation of rotationsOfS2) {
        const norms2Perm = createNormPermutations(s2rotation);

        for (const s2norm of norms2Perm) {
          // and for each rotation, we'll create normalized version of the vectors as well
          const matching = s2norm.filter((v) => {
            return perms1.find((v1) => v1.isEqualTo(v));
          });

          if (matching.length > 11) {

            const m1 = matching.map((v) => perms1.findIndex((v2) => v2.isEqualTo(v)));
            const m2 = matching.map((v) => s2norm.findIndex((v2) => v2.isEqualTo(v)));

            // console.log({m1, m2});

            const ordered = m1.map((id) => s1[id]);
            const ordered2 = m2.map((id) => s2rotation[id]);

            const diff = ordered[0].minus(ordered2[0]);

            return [s2rotation, diff]
          }
        }
      }
    }
  };


  let cache = new Map();

  const cachedCalc = (
    s1: Vector[],
    s2: Vector[]
  ): [Vector[], Vector] => {


    const key = JSON.stringify(s1) + JSON.stringify(s2);

    const bob = cache.get(key);

    if (bob) {
      console.log('hit');
      return bob;
    }

    const val = calcOverlappingInt(s1, s2);

    cache.set(key, val);

    return val;
  }

  const findFirst = (s1) => {
      for (let s2i = 1; s2i < input.length; s2i++) {
        const s2 = input[s2i];

        const find = calcOverlappingInt(s1, s2);
        if (find) {
          return { s2i, s2: find[0], s1, diff: find[1] };
        }
      }
  };

  const first = findFirst(input[0]);
  // console.log(first);
  

  //   console.log(first);
  const found = new Set();

  // const {s1, s2, s1i, s2i,diff} = first;

  const final = [];


  // final[first.s1i] = s1;

  found.add(0);

  // found.add(first.idx);

  // const found = [input[0]]

  const  toCheck = [0];


  const diffs = [new Vector(0, 0, 0)];

  while (toCheck.length) {

    const s1i = toCheck.shift();
    console.log('To check', toCheck, 'popped', s1i);
  
    const s1 = input[s1i];

    const lefts = input.map((s, i) => {
      return {s, i}
    }).filter(item => !found.has(item.i));

    let f = false;

    for (const item of lefts) {
      const s2 = item.s;
      const s2i = item.i;
        // console.log(`Checking ${s1i} and ${s2i}`);
          const find = cachedCalc(s1, s2);
          if (find) {
            const [s2rotated, diff] = find;

            console.log(
              `Found a match of ${s1i} and ${s2i}! ${
                input.length - found.size
              } to go!`
            );

            // console.log();
            

            const combinedDiff = diffs[s1i].plus(diff);

            diffs[s2i] = combinedDiff;

            // s2rotated.map(v => v.plus(diff));

            found.add(s2i);
            toCheck.push(s2i);
            f = true;
            input[s2i] = s2rotated;
            // break;
            // final[s2i] = ns2;
          }
    }


    const missing = input.length - found.size;

    if (!f && toCheck.length === 0 && missing) {
      console.log('GOING TO END! OH NO!', found, 'has ', missing, 'missing');
      const nextUnfound = input.map((s, i) => ({s, i}))
        .filter(({s, i}) => !found.has(i))[0];

      console.log('Next unfound is', nextUnfound.i);
      console.log('Pushing it!');

      found.add(nextUnfound.i);
  
      toCheck.push(nextUnfound.i);

      diffs[nextUnfound.i] = new Vector(nextUnfound.i * 5000, nextUnfound.i * 5000, nextUnfound.i * 5000);
    }

  }

  console.log(diffs);
  

  const total = input.reduce((set, scanner, i) => {

    const diff = diffs[i];
    if (found.has(i)) {
      scanner.forEach((v) => set.add(JSON.stringify(v.plus(diff))));
    }
    return set;
  }, new Set());

  
  let max = -Infinity;

  diffs.forEach((d1, i1) => {
    diffs.forEach((d2, i2) => {

      if (i1 ===  i2) {
        return;
      }
      const dx = Math.abs(d1.x - d2.x);
      const dy = Math.abs(d1.y - d2.y);
      const dz = Math.abs(d1.z - d2.z);

      const curr = dx + dy + dz;

      if (curr > max) {
        max = curr;
      }
    });
  
  });

  // console.log(total);
  return max;

  // return total.size;

  return input.length;
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
