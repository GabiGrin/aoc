import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
	
	const [earliest, buses] = rows;
		// .map(Number);

	// const grid = new Map();
	// rows.forEach((row, y) => {
	// 	row.split('').forEach((cell, x)  => {
	// 		const value = cell;
	// 		setCell({x, y}, value, grid);
	// 	})
	// });

	return buses.split(',').map(Number)]
}

export const solve = (raw: string): any => {
	const buses = parseInput(raw) as any;
	console.log(buses);

	
	let t = 0;
	let found = false;
	while (!found) {

		for (let i = 0; i < buses.length; i++) {
			const b = buses[i];
			if (isNaN(b)) {
				continue;
			}
			
		}

		t++;
		found = true
	}
	return t;

	// return input.length;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `939
7,13,x,x,59,x,31,19`;
		assert.equal(solve(input), 1068781);
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

