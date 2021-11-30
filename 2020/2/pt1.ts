import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';

const toNums = str => str.map(Number);

export const solve = (input: string): any => {
	const n = input.split('\n').map(n => n.trim()).filter((v) => !!v);

	return n.filter((row) => {
		let [range, letter, pass] = row.split(' ');
		const [min, max] = range.split('-').map(Number);

		const a = letter.includes(pass[min - 1]);
		const b = letter.includes(pass[max - 1]);
		return (a || b) && !(a && b);

	}).length;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`;

		assert.equal(solve(input), 1);
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

