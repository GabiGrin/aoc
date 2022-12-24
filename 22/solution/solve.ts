// import { puzzleInput } from "../lib/lib";
import { assert } from "chai";
import { generateKeyPairSync } from "crypto";
import { posix } from "path";
import { getTestCases } from "../runtime/lib/get-tests";
import { readInputFile } from "../runtime/lib/input-output-files";
import { sides } from "./main-sides";
import { bottom, createGrid, left, P, right, top, Vector } from "./utils";

const parseInput = (raw: string) => {
  let [rows, path] = raw.split("\n\n");
  //   console.log(path);

  const grid = createGrid();
  rows.split("\n").forEach((row, y) => {
    row.split("").forEach((char, x) => {
      if (char && char !== " ") {
        grid.set({ x, y }, char);
      }
    });
  });
  const p = [];

  path.replace(/\d+|[LR]/g, (val) => {
    p.push(val);
    return "";
  });

  return {
    grid,
    path: p,
  };
};

const move = (dir, curr) => {
  if (dir === "R") {
    return (curr + 1) % 4;
  } else if (dir === "L") {
    if (curr - 1 < 0) {
      return 3;
    } else {
      return curr - 1;
    }
  }
};

export type Range =
  | {
      x: [number, number];
      y: number;
    }
  | {
      x: number;
      y: [number, number];
    };

export const solve = (raw: string, size = 50): any => {
  const { grid, path } = parseInput(raw);

  const toKey = (v: Vector) => v.x + "," + v.y;
  const fromKey = (k: string) => {
    const [x, y] = k.split(",").map(Number);
    return { x, y };
  };

  const posToFace = new Map();

  const faces = new Set();
  grid.reduce((_, v, pos) => {
    const fx = Math.floor(pos.x / size);
    const fy = Math.floor(pos.y / size);
    posToFace.set(toKey(pos), toKey({ x: fx, y: fy }));
    faces.add(toKey({ x: fx, y: fy }));
    return 0;
  }, 0);

  const isIt = (p: Vector, side: Range) => {
    const xr = typeof side.x === "number" ? [side.x, side.x] : side.x;
    const yr = typeof side.y === "number" ? [side.y, side.y] : side.y;
    return xr[0] <= p.x && xr[1] >= p.x && yr[0] <= p.y && yr[1] >= p.y;
  };

  const getIndexInRange = (pos: Vector, range: Range) => {
    if (!isIt(pos, range)) {
      throw new Error("aint");
    }
    if (typeof range.x === "number") {
      const [fy] = range.y as number[];
      return pos.y - fy;
    } else if (typeof range.y === "number") {
      const [fx] = range.x as number[];
      return pos.x - fx;
    }
  };

  // console.log("index", getIndexInRange({ x: 5, y: 30 }, { x: [0, 10], y: 30 }));

  const getPosInRange = (index: number, range: Range) => {
    if (typeof range.x === "number") {
      const [fy] = range.y as number[];
      return { x: range.x, y: fy + index };
    } else if (typeof range.y === "number") {
      const [fx] = range.x as number[];
      return { x: fx + index, y: range.y };
    }
  };

  const printSide = (side) => {
    return grid
      .reduce((_, v, pos) => {
        if (isIt(pos, side)) {
          return [..._, v];
        }
        return _;
      }, [])
      .join("");
  };

  
  const set = new Set();
  const k = (p: Vector) => `${p.x},${p.y}`;

  const dupes = [];
  sides.forEach((side, i) => {
    let count = 0;

    const { x, y } = side.range;
    if (typeof x === "number") {
      for (let cy = y[0]; cy <= y[1]; cy++) {
        if (set.has(k({ x, y: cy }))) {
          dupes.push(k({ x, y: cy }));
          // throw 'woops' + i + k({y, x: cx})
        }
        set.add(k({ x, y: cy }));
        count++;
      }
    } else if (typeof y === "number") {
      for (let cx = x[0]; cx <= x[1]; cx++) {
        if (set.has(k({ y, x: cx }))) {
          dupes.push(k({ y, x: cx }));
          // throw 'woops' + i + k({y, x: cx})
        }
        set.add(k({ y, x: cx }));
        count++;
      }
    } else {
      throw "wt";
    }

    if (count !== size) {
      throw "wat?";
    }
  });

  sides.forEach((side) => {
    const otherSide = sides[side.mapsTo];
    if (otherSide.mapsTo !== side.num) {
      throw new Error("bad mapping of " + side.num);
    }
    if (otherSide.transform !== side.transform) {
      throw new Error("bad mapping transform");
    }
  });

  console.log((set.size + 7) / sides.length);
  console.log(dupes);

  const startX = grid.reduce((f, v, pos) => {
    return v !== "#" && pos.y === 0 && pos.x < f ? pos.x : f;
  }, Infinity);

  const directions = [right, bottom, left, top];

  let d = 0;
  let curr = { x: startX, y: 0 };

  const printer = grid.copy();

  const mark = (p, d) => {
    printer.set(p, [">", "v", "<", "^", "F"][d]);
  };

  mark(curr, d);

  const warp = (pos: Vector, dir: number) => {
    const opts = sides.filter((side) => {
      return isIt(pos, side.range);
    });

    const correct = ["L", "T", "R", "B"][dir];

    let currSide;
    if (opts.length > 1) {
      const or = [0, 2].includes(dir) ? "H" : "V";
      // const sideOr = ['T', 'B'].includes(opt.)
      const bobs = opts.filter((opt) => {
        return or === (["T", "B"].includes(opt.dir) ? "V" : "H");
      });
      if (bobs.length !== 1) {
        console.log(bobs);

        throw "wo";
      }
      currSide = bobs[0];
    } else {
      currSide = opts[0];
    }

    // const currSide = opts.length === 1 ? opts[0] : ()

    if (opts.length > 1) {
      // throw 'wat';
    }
    // const currSide = opts[0];
    // const currSide = opts[0];
    if (!currSide) {
      console.log("bob", opts, dir, pos);

      throw new Error("whops");
    }

    if (currSide.dir !== correct) {
      console.log(currSide, correct);

      throw new Error(
        `trying to warp from ${pos.x},${pos.y} on ${currSide.num} but on current dir ${dir} and expected to be in ${correct}`
      );
    }

    const otherSide = sides[currSide.mapsTo];
    if (!otherSide) {
      throw new Error("whops");
    }

    const d = ["R", "B", "L", "T"].indexOf(otherSide.dir);
    if (d === -1) {
      throw new Error("what");
    }
    if (currSide.transform !== otherSide.transform) {
      throw "bob";
    }

    const currIndex = getIndexInRange(pos, currSide.range);
    const idx = currSide.transform === 1 ? currIndex : size - 1 - currIndex;
    const otherPos = getPosInRange(idx, otherSide.range);

    return { pos: otherPos, dir: d, currSide, otherSide };
  };

  //   const a = warp({x: 149, y: 0}, 3)
  //   console.log(a);
  //   const b = warp(a.pos, a.dir);
  //   console.log(b);
  //   const b2 = {x: 50, y: 0};

  //   console.log(warp(warp(b1).pos));
  //   throw 'bob'

  let last;
  console.log(path);
  
  while (path.length) {
    const next = path.shift();
    const times = Number(next);
    
    if (isNaN(times)) {
      // console.log('turning', next, 'from', d);
      d = move(next, d);
      console.log('now at', d);
    } else {
      // console.log('moving', times);
      for (let m = 0; m < times; m++) {
        const dir = directions[d];
        if (!dir) {
          throw new Error("" + d);
        }
        let nextTile = dir(curr);
        // console.log(nextTile);

        if (!grid.get(nextTile)) {
          const warpTarget = warp(curr, d);
          const nextPos = warpTarget.pos;

          const val = grid.get(nextPos);
          if (val === "#") {
            break;
          }
          nextTile = nextPos;
          d = warpTarget.dir;
          console.log('now at', d, path.length);

          const nextVal = grid.get(nextTile);
          console.log(
            { m, next },
            "warped from",
            curr,
            "to",
            nextTile,
            warpTarget.currSide,
            d
          );

          if (!nextVal) {
            console.log(curr);
            console.log(warpTarget.currSide.range);
            console.log(warpTarget.otherSide.range);

            console.log(nextTile);

            throw new Error("wopa bad warp");
          }
        }

        const nextVal = grid.get(nextTile);
        if (!nextVal) {
          console.log(curr);
          console.log(nextTile);

          throw new Error("wopa bad moce");
        }
        if (nextVal === "#") {
          // console.log('wall');
          // console.log('wall', nextTile);/
          break;
        }
        // console.log('moved', m, d);
        curr = nextTile;
        last = curr;
        console.log('LAST D', d);
        
        mark(curr, d);
      }
    }
  }

  // mark(curr, 4);
  console.log(printer.toString());
  
  console.log(curr.y, curr.x, d);

  return (curr.y + 1) * 1000 + 4 * (curr.x + 1) + d;
};

// for wallaby
describe("part 1 tests", () => {
  it("passes for case 1 if exists", () => {
    const case1 = getTestCases()[0];
    if (case1) {
      const actual = solve(case1.input, 4);
      assert.equal(actual, case1.expected);
    } else {
      // no test case
    }
  });

  it("passes for case 2 if exists", () => {
    const case2 = getTestCases()[1];
    if (case2) {
      // const actual = solve(case2.input);
      // assert.equal(actual, case2.expected);
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
    // console.log({ actual });
  });
});
