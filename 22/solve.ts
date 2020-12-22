import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n\n');

	const players = rows.map((r) => {
		const [, ...scores] = r.split('\n');
		return scores.map(Number);
	});
		
	return {p1: players[0], p2: players[1]};
}

export const solve = (raw: string): any => {
	const {p1, p2} = parseInput(raw);


	while (p1.length > 0 && p2.length > 0) {

		const n1 = p1.shift();
		const n2 = p2.shift();

		if (n1 > n2) {
			p1.push(n1, n2);
		} else if (n2 > n1) {
			p2.push(n2, n1);
		} else {
			throw 'wa'
		}
	}

	const winner = p1.length > 0 ? p1 : p2;

	return winner.reverse().map((n, i) => n * (i + 1)).reduce((a, p) => a+ p, 0);

	// return input.length;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

		assert.equal(solve(input), 306);
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

