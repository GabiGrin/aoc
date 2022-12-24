// import { puzzleInput } from "../lib/lib";
import { assert } from "chai";
import { getTestCases } from "../runtime/lib/get-tests";
import { readInputFile } from "../runtime/lib/input-output-files";
import {
  bottom,
  bottomLeft,
  bottomRight,
  createGrid,
  left,
  top,
  right,
  topLeft,
  topRight,
  Vector,
  gridFromMatix,
  neighboursWithDiag,
} from "./utils";

const parseInput = (raw: string) => {
  const grid = createGrid();
  const rows = raw.split("\n").map((r, y) => {
    return r.split("").map((c, x) => {
      if (c === "#") {
        grid.set({ x, y }, 1);
      }
    });
  });
  // .map(Number);
  // .map(v => v.split('').map(Number));

  // return gridFromMatix(rows);
  return grid;
};

export const solve = (raw: string, totalRounds = 100000): any => {
  let grid = parseInput(raw);

  const dirs = ["t", "b", "l", "r"];

  const rotateDirs = () => {
    const t = dirs.shift();
    dirs.push(t);
  };

  const dirFn = { t: top, b: bottom, l: left, r: right };
  const valFn = {
    t: [top, topLeft, topRight],
    b: [bottom, bottomLeft, bottomRight],
    l: [left, topLeft, bottomLeft],
    r: [right, topRight, bottomRight],
  };

  const shouldConsider = (p: Vector) => neighboursWithDiag.some(fn => {
	return grid.get(fn(p));
  });

//   console.log(grid.print());


  const key = (v: Vector) => `${v.x},${v.y}`;
  for (let r = 1; r <= totalRounds; r++) {

    const map = new Map();

	const potMoves = new Set();

    // proposing

    grid.reduce((_, val, pos) => {
		if (!val) {
			throw 'wat'
		}

	 if (!shouldConsider(pos)) {
		const k = key(pos);
        const c = map.get(k) || [];
        if (c.length !== 0) {
          throw "bob";
        }
        map.set(k, [...c, key(pos)]);
		return;
	 }
      const proposed = dirs.find((dir) => {
        return valFn[dir].every((fn) => {
          const n = fn(pos);
          return !grid.get(n);
        });
      });

	  
      if (proposed) {
        const v = dirFn[proposed](pos);
        const k = key(v);
        const c = map.get(k) || [];
        map.set(k, [...c, key(pos)]);
		potMoves.add(k);
      } else {
        const k = key(pos);
        const c = map.get(k) || [];
        if (c.length !== 0) {
          throw "bob";
        }
        map.set(k, [...c, key(pos)]);
      }

      return _;
    }, 0);

    const fromKey = (k) => {
      const [x, y] = k.split(",").map(Number);
      return { x, y };
    };

	let moved = false;
    const newGrid = createGrid();
    Array.from(map.entries()).forEach(([k, v]) => {
      if (v.length === 1) {

		if (potMoves.has(k)) {
			moved = true;
		}
        newGrid.set(fromKey(k), 1);
      } else if (v.length === 2) {
        v.forEach((k) => {
          newGrid.set(fromKey(k), 1);
        });
      } else {
        throw "wa";
      }
    });
    // console.log(newGrid.print());

	grid = newGrid;
	rotateDirs();

	if (!moved) {
		return r;
	}
  }

  console.log(grid.print());

  const minX = grid.reduce((x, _, p) => x > p.x ? p.x : x, Infinity)
  const maxX = grid.reduce((x, _, p) => x < p.x ? p.x : x, -Infinity)

  const minY = grid.reduce((y, _, p) => y > p.y ? p.y : y, Infinity)
  const maxY = grid.reduce((y, _, p) => y < p.y ? p.y : y, -Infinity)
  
  console.log(minX, maxX);
  console.log(minY, maxY);
  
  let c = 0;
  for (let x = minX; x <= maxX; x++) {
	for (let y = minY; y <= maxY; y++) {
		if (!grid.get({x,y})) {
			c++;
		}
	}
  }

  return c;

  /*
	If there is no Elf in the N, NE, or NW adjacent positions, the Elf proposes moving north one step.
If there is no Elf in the S, SE, or SW adjacent positions, the Elf proposes moving south one step.
If there is no Elf in the W, NW, or SW adjacent positions, the Elf proposes moving west one step.
If there is no Elf in the E, NE, or SE adjacent positions, the Elf proposes moving east one step.
*/

  // return input.length;
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
    //   const actual = solve(case2.input, 3);
    //   assert.equal(actual, case2.expected);
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
