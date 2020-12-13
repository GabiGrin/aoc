import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(a => {

			const D = a.match(/./)[0];
			const n = parseInt(a.match(/\d+/)[0]);
			// console.log(n, D)
			return {d: D, n};
		})



		// .map(Number);

	// const grid = new Map();
	// rows.forEach((row, y) => {
	// 	row.split('').forEach((cell, x)  => {
	// 		const value = cell;
	// 		setCell({x, y}, value, grid);
	// 	})
	// }

	// console.log(rows);
	return rows;
}



export const solve = (raw: string): any => {
	const input = parseInput(raw);



	const EAST = {x: 1, y: 0};
	const west = {x: -1, y: 0};
	const north = {x: 0, y: -1};
	const south = {x: 0, y: 1};

	const dirs = [EAST, south, west, north];

	let dir = dirs[0];

	let wx = 10;
	let wy = -1;


	let x = 0;
	let y = 0;



	input.forEach(({d, n}) => {
		switch (d) {

			case 'S':
				wy+=n;
				break;
			case 'N':
				wy-=n;
				break;
			case 'E':
				wx+=n;
				break;
			case 'W':
				wx-=n;
				break;
			case 'F':
				x+=wx * n;
				y+=wy * n;
				break;
			case 'R':
				let ang = n * (Math.PI/180);

				var cos = Math.cos(ang);
				var sin = Math.sin(ang);

				//Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);
				let [bx, by] = [Math.round(10000*(wx * cos - wy * sin))/10000, Math.round(10000*(wx * sin + wy * cos))/10000];

				// console.log(wx, wy);
				wx = bx
				wy = by

				console.log(wx, wy);


				break;
			case 'L': {
				let ang = -n * (Math.PI/180);

				var cos = Math.cos(ang);
				var sin = Math.sin(ang);

				//Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);
				let [bx, by] = [Math.round(10000*(wx * cos - wy * sin))/10000, Math.round(10000*(wx * sin + wy * cos))/10000];

				console.log(wx, wy);
				wx = bx
				wy = by


				break;
			}
			default:
				throw 'bob'
		
		}
	})

	return Math.abs(x) + Math.abs(y);
};

describe('bob', () => {	

	it('works for test case 1', () => {
		const input = `R90
F1`;

		// assert.equal(solve(input), 286);
	});
	it('works for test case 1', () => {
		const input = `F10
N3
F7
R180
L90
F11`;

		assert.equal(solve(input), 286);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		assert.equal(solve(puzzleInput), 'bob');
	});
});

