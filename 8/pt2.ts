import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';

export const solve = (input: string): any => {
	const n = input.split('\n').map(n => n.trim()).filter((v) => !!v);
	return 'Not implemented';
}

// console.log(solvePuzzle(puzzleInput1))

describe('bob', () => {
	it('works for test case 1', () => {
		const input = `
		HERE
		`;

		const expected = 424242;
		assert.equal(solve(input), expected);
	});

});