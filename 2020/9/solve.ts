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

export const solve = (raw: string, pre: number = 25): any => {
	const input = parseInput(raw);


	const findNum = () => {
		for (let i = pre; i < input.length; i++) {
			const n = input[i];
			
			const prev = input.slice(i - pre, i).sort();
	
			let ok = false
			
			for (let j = 0; j < pre; j++) {
				for (let k = j + 1; k < pre; k++) {
					const n1 = prev[j];
					const n2 = prev[k];
					// console.log(n1, n2, n);
					if (n1 + n2 === n) {
						ok = true;
					}
				}
			}
			if (!ok) {
				// console.log(i, pre)
				return n;
			}
		}
	}

	const target = findNum();

	console.log({target});


	for (let i = 0; i< input.length; i++) {

		let curr = input[i];

		let min = Infinity;
		let max = -Infinity;

		for (let j = i + 1; j< input.length; j++) {

			console.log('now', curr)
			curr = curr + input[j];

			min = Math.min(min, input[i], input[j]);
			max = Math.max(max, input[i], input[j]);

			if (curr > target) {
				console.log('break', curr, i, j);
				break;
			}

			if (curr === target) {
				console.log('now', curr)
				// console.log('ok', curr, i, j);

				console.log(input[i], input[j]);
				return min + max;
			}
		}
	}


	

	return input.length;
};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

		assert.equal(solve(input, 5), 62);
	});
 1 
	// it('works for test case 2', () => {
	// 	const input = `HERE`;

	// 	assert.equal(solve(input), 424242);
	// });

	it('show the answer when ready!', () => {

		// const expected = 42;

		// assert.equal(solve(puzzleInput, 25), 'bob');
	});
});

