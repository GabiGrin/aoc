import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';

const toNums = str => str.map(Number);

export const solve = (input: string): any => {
	return input.split('\n\n').reduce((acc, gr) => {
		const mem = gr.split('\n');

		const map = mem.reduce((map, member) => {
			member.split('').forEach((c) => {
				map.set(c, (map.get(c) || 0) + 1);
			});
			return map;
		}, new Map());

		const c = Array.from(map.entries())
				.filter(([k, v]) => v === mem.length).length;
		return acc + c;
	}, 0);
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `abc

a
b
c

ab
ac

a
a
a
a

b`;

		assert.equal(solve(input), 6);
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

