import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(Number);

	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw).sort((a, b) => a - b);

	const adapter = input.reduce((a, b) => Math.max(a, b), 0) + 3;

	input.push(adapter);

	const diffs = input.map((n, i) => {
		const last = input[i - 1] || 0;
		return n - last;
	});

	console.log(diffs.join(' '));

    // 4 ^ 1 ^ 4 ^ 2 ^ 3 ^ 4 ^ 4

	let ic = 0;
	const bob = []
	for (let i = 0; i < diffs.length; i++) {
		const v = diffs[i];
		if (v === 1) {
			ic++
		} else if (v === 3) {
			ic && bob.push(ic);
			ic = 0;
		} else {
			throw 'bob'
		}
	}
	console.log(bob);

	return bob .reduce((acc, b) => {

		// 1 -> 1
		// 2 -> 2
		// 3 -> 1 + 1 + 1 | 1 + 2 | 2 + 1 | 3
		// 4 -> 1 + 1 + 1 + 1 | 1 + 3 | 1 + 

		const m = {
			1: 1,
			2: 2,
			3: 4,
			4: 7
		};

		return acc * m[b];

	}, 1)




	
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `16
10
15
5
1
11
7
19
6
12
4`;
// 
		assert.equal(solve(input), 8);
	});

	it('works for test case 1', () => {
		const input = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;

		assert.equal(solve(input), 19208);
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

