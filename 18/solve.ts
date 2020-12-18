import { puzzleInput } from "./puzzle-input";
import {assert} from 'chai';
import { setCell } from "./utils";


const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim().replace(/\s+/g, '').split('').map((c) => {
			if (c.match(/\d+/)) {
				return parseInt(c);
			}
			return c;
		}))
		.filter((v) => !!v)
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	
	const calcMaxDepth = (row) => {
	
		let depth = 0;
		let maxDepth = 0;
		row.forEach((next) => {
			switch (next) {
				case '(':
					depth++;
					maxDepth = Math.max(depth, maxDepth);
					break;
				case ')':
					depth--;
					break;
			}
		});
		return maxDepth;
	}

	const calcGroups = (row, targetDepth) => {
	
		let depth = 0;
		const gr = [];

		let start = 0;
		row.forEach((next, i) => {
			switch (next) {
				case '(':
					depth++;
					if (depth === targetDepth) {
						start = i;
					}
					break;
				case ')':
					if (depth === targetDepth) {

						gr.push([start + 1, i])
					}
					depth--;
					break;
				default:
			}
		})

		return gr;
	}

	const doRange = (row, [s, e]) => {
		const chars = row.slice(s, e);

		console.log({chars})
		let [sum, ...rest] = chars;
		let lastOp = '';
		rest.forEach((c) => {
			console.log(c)
			switch(c) {
				case '+':
				case '*':
					lastOp = c;
					break;
				default:
					console.log(c);
					const n = parseInt(c);
					sum= lastOp === '+' ? sum + n : sum * n;
			}
		});
		return sum;
	}

	const calcRow = (initRow) => {

		let row = initRow;
		let mDepth = calcMaxDepth(initRow);

		// const d = calcMaxDepth(initRow)
		// const g = calcGroups(initRow, d)
		// const bob = doRange(initRow, g[0]);

		while (mDepth > 0){
			let newRow = [...row];
			const gr = calcGroups(row, mDepth).reverse();
			gr.forEach(([s, e]) => {
				const val = doRange(row, [s, e]);
				console.log({s, e});
				newRow.splice(s-1, e-s+2, val);
			})
			console.log(newRow.join(''), row.join(''));
			row = newRow;
			mDepth = calcMaxDepth(row);
		}
		return doRange(row, [0, row.length]);
		// console.log(row);
	}

	const sums = input.map(calcRow);
	console.log(sums);
	return sums.reduce((a, p) => a + p, 0);

};

describe('bob', () => {	
	it('works for test case 1', () => {
		const input = `1 + (2 * 3) + (4 * (5 + 6))`;

		assert.equal(solve(input), 51);
	});

	it('works for test case 1', () => {
		const input = `5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`;

		assert.equal(solve(input), 669060);
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

