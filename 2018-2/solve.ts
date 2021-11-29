import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";
import { SIGUSR1, SSL_OP_NO_TLSv1_1 } from "constants";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		// .map(Number);

	// const grid = new Map();
	// rows.forEach((row, y) => {
	// 	row.split('').forEach((cell, x)  => {
	// 		const value = cell;
	// 		setCell({x, y}, value, grid);
	// 	})
	// }

	console.log(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	console.log(input)
	input.sort();

	const dis = (s1, s2) => {
		return s1.split('').filter((c, i) => {
			return s2[i] === c;
		}).length;
	}

	const marr = input.reduce((a, b) => {
		const d = dis(a, b);
		console.log(a.length, d, a, b);
		
		if (d === 25 || typeof a !== 'string') {
			return [a, b];
		} else {
			return b;
		}
	}, '')

	const [a, b] = marr;
	console.log(a, b)
	return a.split('').filter((c, i) => {
		return b[i] === c;
	}).join('');
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `HERE`;

		assert.equal(solve(input), 424242);
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

