// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map((row) => {
			let [f,t] = row.split(' ');
			const fi = ['A', 'B', 'C'].indexOf(f);
			const ti = ['X', 'Y', 'Z'].indexOf(t);
			const b = ['r','p', 's'];

			f = b[fi]
			let g = '';
			if (t === 'X') {
				if (f === 'p') g = 'r'
				if (f === 's') g = 'p'
				if (f === 'r') g = 's'
			} else if (t === 'Y') {
				g = b[fi]
			} else {
				if (f === 'p') g = 's'
				if (f === 's') g = 'r'
				if (f === 'r') g = 'p'
			}

			

			return {f: b[fi], t: g};
			
		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}

export const solve = (raw: string): any => {


	const scoreitem = {r: 1, p: 2, s: 3};
	const scoreres = {d: 3, w: 6};
	
	const input = parseInput(raw)

	return input.reduce((score, curr) => {

		const {f, t} = curr;

		score += scoreitem[t];

		let b = 0;
		if (f === t) b = 3;

		if (f === 'p' && t ==='s') b = 6;
		if (f === 'r' && t ==='p') b = 6;
		if (f === 's' && t ==='r') b = 6;

		console.log(b, score);

		return score + b;

		
		
	},0);


	return input.length;
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
