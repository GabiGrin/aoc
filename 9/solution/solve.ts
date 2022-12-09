// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { bottomLeft, bottomRight, createGrid, dirs, neighboursWithDiag, range, topLeft, topRight, vectorEquals } from './utils';
import { simpleAdd } from './utils/math';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {
			const [d, n] = r.split(' ');

			// const 
			return {d, n: Number(n)}
		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);
	// console.log(input);

	const grid = createGrid();
	const rope = range(10).map(b => ({x: 0, y: 0}));

	const calcNext = (h, t) => {
		if (t.x === h.x && t.y === h.y) {
			return t;
		}

		if (t.x === h.x) {
			if (h.y > t.y) {
				return dirs.D(t);
			} else {
				return dirs.U(t);
			}
		} else if (t.y === h.y) {
			if (h.x > t.x) {
				return dirs.R(t);
			} else {
				return dirs.L(t);
			}
		} else if (t.x > h.x && t.y > h.y) {
			return topLeft(t);
		} else if (t.x > h.x && t.y < h.y) {
			return bottomLeft(t);

		} else if (t.x < h.x && t.y > h.y) {
			return topRight(t);

		}else if (t.x < h.x && t.y < h.y) { 
			return bottomRight(t);
		}
		throw 'bob'
	}

	const isAdj = (t, h) => {
		if (vectorEquals(t, h)) {
			return true;
		}
		return neighboursWithDiag.some(fn => {
			return vectorEquals(t, fn(h));
		})
	}

	let first = 0

	// grid.set(t, 1);

	input.forEach(({d, n}) => {
		
		const dir = dirs[d];
		for (let i = 0; i< n; i++) {

			rope[0] = dir(rope[0]);

			rope.forEach((_, idx) => {
				let h = rope[idx];
				let t = rope[idx + 1];
				if (t) {
					if (!isAdj(h, t)) {
						t = calcNext(h, t);
					}
					rope[idx] = h;
					rope[idx + 1] = t;
				}
			})
			console.log(rope);
			
			grid.set(rope[9], 1);

			// grid.set(h, 1);
			
			
			// console.log(h, t);
		}

		
		// console.log(grid.toString());
		// throw new 'b'

		

	})

	// console.log(grid.toString());
	

	return grid.reduce((acc, curr) => simpleAdd(acc,curr), 0)
	

	return -1;
};

// for wallaby
describe('part 1 tests', () => {
	it('passes for case 1 if exists', () => {
		const case1 = getTestCases()[0];
		if (case1) {
			const actual = solve(case1.input);			
			assert.equal(actual, case1.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 2 if exists', () => {
		const case2 = getTestCases()[1];
		if (case2) {
			const actual = solve(case2.input);
			assert.equal(actual, case2.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 3 if exists', () => {
		const case3 = getTestCases()[2];
		if (case3) {
			const actual = solve(case3.input);
			assert.equal(actual, case3.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 4 if exists', () => {
		const case4 = getTestCases()[3];
		if (case4) {
			const actual = solve(case4.input);
			assert.equal(actual, case4.expected);
		} else {
			// no test case
		}
	});

	it('passes for case 5 if exists', () => {
		const case5 = getTestCases()[4];
		if (case5) {
			const actual = solve(case5.input);
			assert.equal(actual, case5.expected);
		} else {
			// no test case
		}
	});

	it('passes input if exists', () => {
		const input = readInputFile();
		
		
		const actual = solve(input);
		console.log({actual});
	});
})
