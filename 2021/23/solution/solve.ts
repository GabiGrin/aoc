// import { puzzleInput } from "../lib/lib";
import { assert } from "chai";
import { getTestCases } from "../runtime/lib/get-tests";
import { readInputFile } from "../runtime/lib/input-output-files";
import {
  State,
  canGo,
  restPositions,
  calcInitPos,
  isDone,
  cost,
  rooms,
  isResting,
  strState,
  print,
} from "./lib";
import {
  calcNeighbours,
  createGrid,
  entries,
  Grid,
  gridFromMatix,
  id,
  Vector,
  vectorEquals,
} from "./utils";

const parseInput = (raw: string) => {
  const rows = raw.split("\n").map((r) => r.split(""));

  // .map(Number);
  // .map(v => v.split('').map(Number));

  return gridFromMatix(rows);
  // return rows;
};
/*

Amphipods will never stop on the space immediately outside any room.
They can move into that space so long as they immediately continue moving.
(Specifically, this refers to the four open spaces in the hallway that 
are directly above an amphipod starting position.)

Amphipods will never move from the hallway into a room unless that room is their destination
room and that room contains no amphipods which do not also have that room as their own destination.
If an amphipod's starting room is not its destination room, it can stay in that room until it leaves the room.
(For example, an Amber amphipod will not move from the hallway into the right three rooms,
and will only move into the leftmost room if that room is empty or if it only contains other Amber amphipods.)

Once an amphipod stops moving in the hallway, it will stay in that spot until it can move into a room.
(That is, once any amphipod starts moving, any other amphipods currently in the hallway are
locked in place and will not move again until they can move fully into a room.)

*/

const validMoves = (
  type: keyof State,
  state: State,
  grid: Grid
): Array<{ p: Vector; l: number }> => {
  const pos = state[type];

  const targetRoom = rooms[type];
  const letter = type.substring(0, 1);

  const typesInRoom = Object.entries(state)
    .filter((e) => e[1].x === targetRoom)
    .map((e) => e[0]);

  const roomVacant = typesInRoom.every((l) => l.includes(letter));
//   console.log({ typesInRoom, roomVacant, type });
  if (pos.x === rooms[type] && roomVacant) {
    return [];
  }

  if (roomVacant) {
    const len = typesInRoom.length;
    const target = { y: 5 - len, x: targetRoom };

    // console.log({typesInRoom, len, type, target});
    const can = canGo(grid, state, type, target);
    if (can) {
      return [can];
    }
  }

  if (!isResting(pos)) {
    const bobs = restPositions
      .map((pos) => {
        return canGo(grid, state, type, pos);
      })
      .filter((i) => !!i) as any[];

    return bobs;
  }

  return [];
};

export const solve = (raw: string): any => {
  const grid = parseInput(raw);

  const initState = calcInitPos(grid);

  // console.log(initState);

  const v1 = validMoves("A1", initState, grid);
  assert.equal(v1.length, 0);

  const visited = new Set();

  const queue = [{ s: initState, e: 0, ss: [initState] }];

  const ks = Object.keys(initState) as Array<keyof State>;

  const finished = [];

  let i = 0;

  while (queue.length) {
    const { s, e, ss } = queue.pop();

    // console.log(print(grid, s));

    if (visited.has(strState(s) + e)) {
      //   throw "2";
      // console.log('visited', strState(s));
      continue;
    }

    visited.add(strState(s)+ e);

    if (isDone(s)) {
      finished.push({e, ss});
    //   console.log(print(grid, s));

    //   console.log("found", e);
      continue;
    }

    const nextPossible = ks.reduce<Array<{ s: State; e: number, ss: State[] }>>((acc, k) => {
      const valid = validMoves(k, s, grid);

      const sAndE = valid.map((pl) => {
        const energyReq = pl.l * cost[k];
        const newState: State = { ...s, [k]: pl.p };
        return { s: newState, e: e + energyReq, ss: [] };
      });
      // .filter((se) => {
      //   return !visited.has(strState(se.s));
      // });

      return [...acc, ...sAndE];
    }, []);

    if (i++ % 1000 === 0) {
    //   console.log(print(grid, s));
      console.log({ i, q: queue.length });
    }

    // if (!queue.length) {
    //   console.log(i++);
    //   console.log(print(grid, s));
    // }


    queue.push(...nextPossible);
  }

  const min = finished.reduce((acc, curr) => {
	  if (curr.e < acc.e) {
		  return curr;
	  }
	  return acc;
  });

//   console.log(min);
  

  min.ss.forEach((s, i) => {
	  console.log(`Step ${i}`);

	  console.log(print(grid, s));
  });

//   const en = Math.min(...finished);

  return min.e;
};

// for wallaby
const testCases = getTestCases();
describe("part 1 tests", () => {
  it.only("works lib", () => {
    const g = parseInput(testCases[0].input);
    const init = calcInitPos(g);

    const nextMoveA1 = validMoves("A1", init, g);
    const nextMoveB1 = validMoves("B1", init, g);

    assert.equal(nextMoveA1.length, 0);
    assert.equal(nextMoveB1.length, 7);
    console.log(init.B1);

    console.log(nextMoveB1);
  });

  it("bob", () => {
    const a = `#############
#.....D....#
###.#B#C#D###
  #A#B#C#A#
  #########`;

    const g = parseInput(a);
    const init = calcInitPos(g);

    const nextMoveA1 = validMoves("D1", init, g);
    console.log(nextMoveA1);

    const bob = solve(a);
    console.log(bob);

    const nextMoveB1 = validMoves("B1", init, g);
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
