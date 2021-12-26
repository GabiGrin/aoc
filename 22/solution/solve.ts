// import { puzzleInput } from "../lib/lib";
import { assert } from "chai";
import { getTestCases } from "../runtime/lib/get-tests";
import { readInputFile } from "../runtime/lib/input-output-files";
import { breakOffs, calcArea, cleanContained, cleanDupes, cleanOverlapping2, Cubiod, cuts2, intersects, isInside } from "./lib";
import { createGrid, isDefined } from "./utils";

const parseInput = (raw: string) => {
  const rows = raw.split("\n").map((n) => {
    const [_, ins, ...rest] = n.match(
      /(on|off).*x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
    );
    const [fx, tx, fy, ty, fz, tz] = rest.map(Number).map((n) => {
      return n;
      // return Math.max(-50, Math.min(n, 50));
    });
    // console.log({fx, tx,fy,ty,fz,tz, ins});
    return { x: [fx, tx + 1], y: [fy, ty + 1], z: [fz, tz + 1], ins } as Cubiod;
  });

  return rows;
};

export const solve = (raw: string): any => {
  const input = parseInput(raw);

  let cubesOn = breakOffs([...input]);
  console.log(cubesOn.length);

  cubesOn = cleanDupes(cubesOn);
  console.log(cubesOn.length);

  console.log(cubesOn);

  cubesOn = cleanContained(cubesOn);
  
  
  console.log("final", cubesOn.length);

  const cleaned2 = cleanOverlapping2(cubesOn);
  // const cleaned2 = cubesOn;

  // console.log(area);
  console.log(cleaned2.length);
  // console.log(cleaned2.length);

  // console.log(cleaned2);
  

  return cleaned2.reduce((acc, curr) => {

    const area = calcArea(curr);

      // console.log(curr, area);
      
    if (area <= 0) {
      throw "up";
    }
    return acc + area;
  }, 0);
};

// for wallaby
describe("part 1 tests", () => {

  it.only('works for basic', () => {

//     assert.equal(solve('on x=1..2,y=1..1,z=1..1'), 2)

//     assert.equal(solve(`on x=1..2,y=1..1,z=1..1
// off x=1..1,y=1..1,z=1..1`), 1)

// assert.equal(solve(`on x=1..4,y=1..1,z=1..1
// off x=1..1,y=1..1,z=1..1`), 3)

    const c1: Cubiod = {x: [0, 2], y: [0, 2], z: [0, 2], ins: 'on'}
    const c2: Cubiod = {x: [2, 5], y: [2, 5], z: [2, 5], ins: 'on'}
    const c3: Cubiod = {x: [1, 2], y: [1, 3], z: [1, 3], ins: 'on'}

    // assert.equal(intersects(c1, c3), true); 
    // assert.equal(intersects(c2, c3), false);
    // assert.equal(intersects(c1, c2), false);

    assert.equal(solve(`on x=10..12,y=10..12,z=10..12
    on x=11..13,y=11..13,z=11..13
    off x=9..11,y=9..11,z=9..11
    on x=10..10,y=10..10,z=10..10`), 39)

//     assert.equal(solve('on x=10..12,y=10..12,z=10..12'), 27)
    
//     const list = `on x=10..12,y=10..12,z=10..12
// on x=11..13,y=11..13,z=11..13`
//     assert.equal(solve(list), 46)

//     const list2 = `on x=10..12,y=10..12,z=10..12
// on x=11..13,y=11..13,z=11..13
// off x=9..11,y=9..11,z=9..11`

//     assert.equal(solve(list2), 38)
  })
  it("passes for case 1 if exists", () => {
    // const case1 = getTestCases()[];
    // if (case1) {
      // const actual = solve(case1.input);
      // assert.equal(actual, case1.expected);
    // } else {
      // no test case
    // }
  });
});
