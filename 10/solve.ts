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

	// console.log(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw).sort((a, b) => a - b);

	const adapter = input.reduce((a, b) => Math.max(a, b), 0) + 3;

	input.push(adapter);

	let curr = 0;

	let d1 = 0;
	let d3 = 0;

	for (let i = 0; i< input.length; i++) {
		const v = input[i];
		console.log(curr, v);
		
		const diff = v - curr;
		// curr+=v;
		switch (diff) {
			case 1:
				d1++;
				curr += 1;
				break;
			case 2:
				curr += 2;
				// d1++;
				break;
			case 3:
				curr += 3;
				d3++;
				break;
			default:
				console.log('diff', diff);
				throw 'oops'
		}


		
	}

	// while ()

	return d1 * d3;
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

		// assert.equal(solve(puzzleInput), 'bob');
	});
});

