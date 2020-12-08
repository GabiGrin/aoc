import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';

const toNums = str => str.map(Number);

export const solve = (input: string): any => {
	const n = input.split('\n').map(n => n.trim()).filter((v) => !!v);


	let mat = [];

	const calc = (s) => {
		const row = s.slice(0, 7);
		const col = s.slice(7);

		let range = 'x'.repeat(128).split('').map((_, i) => i);
		
		row.split('').forEach((c) => {
			console.log(range.length);
			if (c === 'F') {
				range = range.slice(0, range.length / 2)
			} else {
				range = range.slice(range.length / 2);
			}
		});

		let r= range[0]

		range = 'x'.repeat(8).split('').map((_, i) => i);

		col.split('').forEach((c) => {
			if (c === 'L') {
				range = range.slice(0, range.length / 2)
			} else {
				range = range.slice(range.length / 2);
			}
		});
		
		let c = range[0];

		return [r, c];
	}

	n.forEach((p) => {
		const [r, c] = calc(p);

		if (!mat[r]) mat[r] = [];

		mat[r][c] = true;
	}, 0);

	let missing = [];

	for (let x = 0; x < 128; x++) {
		for (let y = 0; y < 8; y++) {
			if (mat[x] && !mat[x][y]) {
				missing.push([x, y]);
			}
		}
	}

	console.log(missing);


};

describe('bob', () => {	
	it('works for test case 1', () => {

		// assert.equal(solve(`FBFBBFFRLR`), 357);
		// assert.equal(solve(`BFFFBBFRRR`), 567);
		// assert.equal(solve(`FFFBBBFRRR`), 119);
		// assert.equal(solve(`BBFFBBFRLL`), 820);
	});

	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	// it('works for test case 3', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		assert.equal(solve(puzzleInput), 'bob');
	});
});

