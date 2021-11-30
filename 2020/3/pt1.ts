import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';

const toNums = str => str.map(Number);

export const solve = (input: string): any => {
	const rows = input.split('\n').map(n => n.trim()).filter((v) => !!v);
	console.log(rows);

	

	const combs = [
		[1, 1],
		[3, 1],
		[5, 1],
		[7, 1],
		[1, 2]
	];

	let t = 1;
	combs.forEach(([dx, dy]) => {
		let x = dx;
		let n = 0;
		for (let y = dy; y < rows.length; y = y + dy) {
			const r = rows[y];
			const c = r[x % r.length];
			console.log(c);
			if (c === '#') {
				n++;
			}
			x = x + dx;
		}
		t = t * n;
	})

	return t;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`;

		assert.equal(solve(input), 336);
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

