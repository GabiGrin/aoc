import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { bottom, bottomLeft, bottomRight, getCell, left, right, setCell, topLeft, topRight, top } from "./utils";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		// .map(Number);

	const grid = new Map();
	rows.forEach((row, y) => {
		row.split('').forEach((cell, x)  => {
			const value = cell;
			setCell({x, y}, value, grid);
		})
	});
	console.log(grid);
	return {grid, h: rows.length, w: rows[0].length};

	// console.log(rows);
	// return rows;
}

export const solve = (raw: string): any => {
	let {w, h, grid} = parseInput(raw);

	// console.log(w, h);

	let r = 0;

	const run = () => {
		let c = false;
		r++;

		let nextGrid = new Map(grid);

		for (let x = 0; x < w; x++) {
			for (let y = 0; y < h; y++) {

				const v = getCell({x, y}, grid);
				// console.log({x, y});

				const neighbours = [top, topLeft, topRight, left, right, bottom, bottomLeft, bottomRight]
				.map((pos) => {

					// let 
					let n = pos({x ,y});

					let v = getCell(n, grid);
					while (v && v === '.') {
						n = pos(n);
						v = getCell(n, grid);
					}
					return v || '.';
				 });
				 const occ = neighbours.filter((c) => c === '#').length;

				 if (v === 'L' && occ=== 0) {
					 setCell({x, y}, '#', nextGrid);
					//  console.log(grid);
					 c = true;
				 } else if ( v === '#' && occ > 4) {
					setCell({x, y}, 'L', nextGrid);
					c = true;
				 }

				//  console.log(getCell({x, y}, grid));


			}
		}
		grid = nextGrid;
		// console.log({c});
		return c;
	}

	let bob = run();
	while(bob) {
		bob = run();
	}


	let c = 0;
	for (let x = 0; x < w; x++) {
		for (let y = 0; y < h; y++) {

			const v = getCell({x, y}, grid);
			if (v === '#') c++;
		}
	}

	return c;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

		assert.equal(solve(input), 26);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		// assert.equal(solve(puzzleInput), 'bob');
	});
});

