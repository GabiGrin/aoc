import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {

	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(Number);

	// const grid = new Map();
	// rows.forEach((row, y) => {
	// 	row.split('').forEach((cell, x)  => {
	// 		const value = cell;
	// 		setCell({x, y}, value, grid);
	// 	})
	// }
	return rows
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	let reached = new Set();
	let found;
	input.reduce((prev, curr, _, arr) => {
		const t = prev + curr;
		if (reached.has(t)) {
			found = t;
			arr = [];
		} else {
			reached.add(t);
			arr.unshift(curr);
		}
		return t;
	}, 0)

	return found;

};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `HERE`;

		assert.equal(solve(input), 73364);
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

