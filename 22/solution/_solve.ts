// // import { puzzleInput } from "../lib/lib";
// import { assert } from "chai";
// import { generateKeyPairSync } from "crypto";
// import { posix } from "path";
// import { getTestCases } from "../runtime/lib/get-tests";
// import { readInputFile } from "../runtime/lib/input-output-files";
// import { bottom, createGrid, left, P, right, top, Vector } from "./utils";

// const parseInput = (raw: string) => {
//   let [rows, path] = raw.split("\n\n");
//   console.log(path);

//   const grid = createGrid();
//   rows.split("\n").forEach((row, y) => {
//     row.split("").forEach((char, x) => {
//       if (char && char !== " ") {
//         grid.set({ x, y }, char);
//       }
//     });
//   });
//   const p = [];

//   path.replace(/\d+|[LR]/g, (val) => {
//     p.push(val);
//     return "";
//   });

//   return {
//     grid,
//     path: p,
//   };
// };

// const move = (dir, curr) => {
//   if (dir === "R") {
//     return (curr + 1) % 4;
//   } else if (dir === "L") {
//     if (curr - 1 < 0) {
//       return 3;
//     } else {
//       return curr - 1;
//     }
//   }
// };

// type Range = {
// 	x:[number, number],
// 	y: number
// } | {
// 	x: number,
// 	y: [number, number]
// };


// export const solve = (raw: string, size = 50): any => {
//   const { grid, path } = parseInput(raw);

//   const toKey = (v: Vector) => v.x + "," + v.y;
//   const fromKey = (k: string) => {
//     const [x, y] = k.split(",").map(Number);
//     return { x, y };
//   };

//   const posToFace = new Map();

//   const faces = new Set();
//   grid.reduce((_, v, pos) => {
//     const fx = Math.floor(pos.x / size);
//     const fy = Math.floor(pos.y / size);
//     posToFace.set(toKey(pos), toKey({ x: fx, y: fy }));
//     faces.add(toKey({ x: fx, y: fy }));
//     return 0;
//   }, 0);


//   const isIt = (p: Vector, side: Range) => {
//     const xr = typeof side.x === "number" ? [side.x, side.x] : side.x;
//     const yr = typeof side.y === "number" ? [side.y, side.y] : side.y;
//     return xr[0] <= p.x && xr[1] >= p.x && yr[0] <= p.y && yr[1] >= p.y;
//   };

//   const getIndexInRange = (pos: Vector, range: Range) => {
// 	if (!isIt(pos, range)) {
// 		throw new Error('aint');
// 	}
// 	if (typeof range.x === 'number') {
// 		const [fy] = range.y as number[];
// 		return pos.y - fy;
	
// 	} else if (typeof range.y === 'number') {
// 		const [fx] = range.x as number[];
// 		return pos.x - fx;
// 	}
//   }

//   const getPosInRange = (index: number, range: Range) => {
// 	if (typeof range.x === 'number') {
// 		const [fy] = range.y as number[];
// 		return {x: range.x, y: fy + index};
	
// 	} else if (typeof range.y === 'number') {
// 		const [fx] = range.x as number[];
// 		return {x: fx + index, y: range.y};
// 	}
//   }

//   const printSide = (side) => {
//     return grid
//       .reduce((_, v, pos) => {
//         if (isIt(pos, side)) {
//           return [..._, v];
//         }
//         return _;
//       }, [])
//       .join("");
//   };

//   const sides: Array<{range: Range, mapsTo: number, num: number, transform:  (p: Vector, thisSide: Range, otherSide: Range) => Vector, dir: 'R' | 'B' | 'L' | 'T'}> = [
//     {
//       range: { x: [50, 99], y: 0 },
//       mapsTo: 9,
// 	  num: 0,
// 	  dir: 'B',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(idx, otherSide);
//       },
//     },
//     {
//       range: { x: [100, 149], y: 0 },
//       mapsTo: 8,
// 	  num: 1,
// 	  dir: 'B',
// 	  transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(idx, otherSide);
//       },
//     },
//     {
//       range: { x: 149, y: [0, 49] },
//       mapsTo: 5,
// 	  num: 2,
// 	  dir: 'L',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(49 - idx, otherSide);
//       },
//     },
//     {
//       range: { x: [100, 149], y: 49 },
//       mapsTo: 4,
// 	  num: 3,
// 	  dir: 'T',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(idx, otherSide);
//       },
//     },
//     {
//       range: { x: 99, y: [50, 99] },
//       mapsTo: 3,
// 	  num: 4,
// 	  dir: 'L',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(idx, otherSide);
//       },
//     },
//     {
//       range: { x: 99, y: [100, 149] },
//       mapsTo: 2,
// 	  num: 5,
// 	  dir: 'L',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(49 - idx, otherSide);
//       },
//     },
//     {
//       range: { x: [50, 99], y: 149 },
//       mapsTo: 7,
// 	  num: 6,
// 	  dir: 'T',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(idx, otherSide);
//       },
//     },
//     {
//       range: { x: 49, y: [150, 199] },
//       mapsTo: 6,
// 	  num: 7,
// 	  dir: 'L',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(idx, otherSide);
//       },
//     },
//     {
//       range: { x: [0, 49], y: 199 },
//       mapsTo: 1,
// 	  num: 8,
// 	  dir: 'T',
// 	  transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(idx, otherSide);
//       },
//     },
//     {
//       range: { x: 0, y: [150, 199] },
//       mapsTo: 0,
// 	  num: 9,
// 	  dir: 'R',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(idx, otherSide);
//       },
//     },
//     {
//       range: { x: 0, y: [100, 149] },
//       mapsTo: 13,
// 	  num: 10,
// 	  dir: 'R',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(49 - idx, otherSide);
//       },
//     },
//     {
//       range: { x: [0, 49], y: 100 },
//       mapsTo: 12,
// 	  num: 11,
// 	  dir: 'B',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(idx, otherSide);
//       },
//     },
//     {
//       range: { x: 50, y: [50, 99] },
//       mapsTo: 11,
// 	  num: 12,
// 	  dir: 'R',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(idx, otherSide);
//       },
//     },
//     {
//       range: { x: 50, y: [0, 49] },
//       mapsTo: 10,
// 	  num: 13,
// 	  dir: 'R',
//       transform: (p: Vector, thisSide: Range, otherSide: Range) => {
//         const idx = getIndexInRange(p, thisSide);
// 		return getPosInRange(49 - idx, otherSide);
//       },
//     },
//   ];


//   // console.log(printSide(sides[0]));
//   // console.log(printSide(sides[1]));
//   // console.log(printSide(sides[2]));
//   // console.log(printSide(sides[3]));
//   // console.log(printSide(sides[4]));
//   // console.log(printSide(sides[5]));
//   // console.log(printSide(sides[6]));
//   // console.log(printSide(sides[7]));
//   // console.log(printSide(sides[8]));
//   // console.log(printSide(sides[9]));
//   // console.log(printSide(sides[10]));
//   // console.log(printSide(sides[11]));
//   // console.log(printSide(sides[12]));
//   // console.log(printSide(sides[13]));

//   /* 
// 		// 14 sides, each side is connected to another side by pixel and direction

// 		// sides ordered clock-wise starting with top one
// 			// side 1: x: 50  - 99   ,   y: 0 | maps to side
// 			// side 2: x: 100 - 149  ,   y; 0 | maps to side
// 			// side 3: x: 149, y: 0 -49
// 	*/

//   const startX = grid.reduce((f, v, pos) => {
//     return v !== "#" && pos.y === 0 && pos.x < f ? pos.x : f;
//   }, Infinity);

//   const warpRight = (p: Vector) => {
//     const v = grid.reduce((f, v, pos) => {
//       return v && pos.y === p.y && pos.x < f ? pos.x : f;
//     }, Infinity);

//     return { ...p, x: v };
//   };

//   const warpLeft = (p: Vector) => {
//     const v = grid.reduce((f, v, pos) => {
//       return v && pos.y === p.y && pos.x > f ? pos.x : f;
//     }, -Infinity);
//     return { ...p, x: v };
//   };

//   const warpTop = (p: Vector) => {
//     const v = grid.reduce((f, v, pos) => {
//       return v && pos.x === p.x && pos.y > f ? pos.y : f;
//     }, -Infinity);
//     return { ...p, y: v };
//   };

//   const warpBottom = (p: Vector) => {
//     const v = grid.reduce((f, v, pos) => {
//       if (!v) {
//         throw "wat";
//       }
//       return v && pos.x === p.x && pos.y < f ? pos.y : f;
//     }, Infinity);

//     return { ...p, y: v };
//   };

//   const directions = [right, bottom, left, top];

//   const warps = [warpRight, warpBottom, warpLeft, warpTop];

//   let d = 0;
//   let curr = { x: startX, y: 0 };

//   const printer = grid.copy();

//   const mark = (p, d) => {
//     printer.set(p, [">", "v", "<", "^"][d]);
//   };

//   mark(curr, d);

//   const warp = (pos: Vector) => {
// 	const currSide = sides.find(side => {
// 		return isIt(pos, side.range);
// 	})
// 	if (!currSide) {
// 		throw new Error('whops');
// 	}

// 	const otherSide = sides[currSide.mapsTo];
// 	if (!otherSide) {
// 		throw new Error('whops');
// 	}


// 	const ['R', 'B', 'L', 'T']
// 	return {pos: currSide.transform(pos,  currSide.range, otherSide.range), dir };
//   }

//   // while (path.length) {
//   // 	const next= path.shift();
//   // 	const times = Number(next);
//   // 	if (isNaN(times)) {
//   // 		// console.log('turning', next, 'from', d);
//   // 		d = move(next, d);
//   // 		// console.log('now at', d);
//   // 	} else {
//   // 		// console.log('moving', times);
//   // 		for (let m = 0; m < times; m++) {
//   // 			const dir = directions[d];
//   // 			if (!dir) {
//   // 				throw new Error(''+ d);
//   // 			}
//   // 			let nextTile = dir(curr);
//   // 			// console.log(nextTile);

//   // 			if (!grid.get(nextTile)) {
//   // 				nextTile = warps[d](curr);
//   // 				const nextVal = grid.get(nextTile);
//   // 				// console.log({m, next}, 'warped from', curr, 'to', nextTile);
//   // 			}

//   // 			const nextVal = grid.get(nextTile);
//   // 			if (!nextVal) {
//   // 				throw new Error('wopa')
//   // 			}
//   // 			if (nextVal === '#') {
//   // 				// console.log('wall');
//   // 				// console.log('wall', nextTile);/
//   // 				break;
//   // 			}
//   // 			// console.log('moved', m, d);
//   // 			curr = nextTile;
//   // 			mark(curr, d)
//   // 		}
//   // 	}

//   // }

//   // console.log(printer.toString());

//   return (curr.y + 1) * 1000 + 4 * (curr.x + 1) + d;
// };

// // for wallaby
// describe("part 1 tests", () => {
//   it("passes for case 1 if exists", () => {
//     const case1 = getTestCases()[0];
//     if (case1) {
//       // const actual = solve(case1.input, 4);
//       // assert.equal(actual, case1.expected);
//     } else {
//       // no test case
//     }
//   });

//   it("passes for case 2 if exists", () => {
//     const case2 = getTestCases()[1];
//     if (case2) {
//       // const actual = solve(case2.input);
//       // assert.equal(actual, case2.expected);
//     } else {
//       // no test case
//     }
//   });

//   it("passes for case 3 if exists", () => {
//     const case3 = getTestCases()[2];
//     if (case3) {
//       const actual = solve(case3.input);
//       assert.equal(actual, case3.expected);
//     } else {
//       // no test case
//     }
//   });

//   it("passes for case 4 if exists", () => {
//     const case4 = getTestCases()[3];
//     if (case4) {
//       const actual = solve(case4.input);
//       assert.equal(actual, case4.expected);
//     } else {
//       // no test case
//     }
//   });

//   it("passes for case 5 if exists", () => {
//     const case5 = getTestCases()[4];
//     if (case5) {
//       const actual = solve(case5.input);
//       assert.equal(actual, case5.expected);
//     } else {
//       // no test case
//     }
//   });

//   it.only("passes input if exists", () => {
//     const input = readInputFile();

//     const actual = solve(input);
//     console.log({ actual });
//   });
// });
