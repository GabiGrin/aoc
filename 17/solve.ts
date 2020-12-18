import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { entries, fromId, setCell, getCell, id } from "./utils";


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
			setCell({x, y, z: 1, w: 1}, value, grid);
		})
	});

	return grid;
}

const getNei = (p, o: any = {}) => {

	if (typeof o.z === 'number') {
		const opts =  [-1, 0, 1].map((n) => {
			return {...o, w: p.w + n};
		});
		return opts;
	} else if (typeof o.y === 'number') {
		const opts =  [-1, 0, 1].map((n) => {
			return {...o, z: p.z + n};
		});

		return opts.map((o) => getNei(p, o));
	} else if (typeof o.x === 'number') {
		const opts =  [-1, 0, 1].map((n) => {
			return {...o, y: p.y + n};
		});

		return opts.map((o) => getNei(p, o));
	} else {
		const opts =  [-1, 0, 1].map((n) => {
			return {x: p.x + n};
		});

		return opts.map((o) => getNei(p, o));
	}
}

export const solve = (raw: string, cycles = 6): any => {
	const input = parseInput(raw);

	let grid = input;

	for (let c = 0; c < cycles; c++ ) {

		const newGrid = new Map(grid);

		const  vis = new Set();

		const simulateRound = (sourceGrid, targetGrid, pos) => {
			const newNeigh = [];

			const ne = getNei(pos);

			console.log(ne.length);

			const v = getCell(pos, sourceGrid);

			let actions = 0;

			if (v === '#') {
				ne.forEach(n => {
					if (!getCell(n, sourceGrid)) {
						setCell(n, '.', targetGrid);
						newNeigh.push(n);
					}
				});

			}


			const act = ne.filter((p) => {
				const vv = getCell(p, sourceGrid);
				return vv === '#';
			});
			

			if (v === '#') {
				if (act.length === 2 || act.length === 3) {
					// ok! stays
				} else {
					// bad
					setCell(pos, '.', targetGrid);
					actions++;
				}
			} else {
				// '.'
				if (act.length === 3) {
					setCell(pos, '#', targetGrid);
					actions++;
				} else {
					// stays
				}
			}

			vis.add(id(pos));
			
			return newNeigh;
			// if (actions > 0) {
			// 	console.log(actions);
			// } else {
			// 	return [];
			// }

		}


		let toDo = [...entries(grid).map(([k]) => {
			const [x, y, z, w] = fromId(k);
			return {x, y, z, w};
		})];


		while (toDo.length) {

			const next = toDo.pop();

			const more = simulateRound(grid, newGrid, next);

			toDo.push(...more);
		}

		grid = newGrid;

		// for ()getNei
	}

	// console.log(grid);

	return entries(grid).filter(([k, v]) => v === '#').length;

	// return input.length;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `.#.
..#
###`;

		assert.equal(solve(input, 2), 60);
		// assert.equal(solve(input), 848);
	}).timeout(20000);

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		// assert.equal(solve(puzzleInput), 'bob');
	});
});

