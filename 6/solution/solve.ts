// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => {
			return r;
		})
		// .map(Number);
		// .map(v => v.split('').map(Number));

	// return gridFromMatix(rows);
	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	const line = input[0].split('');

	for (let i = 14; i < line.length; i++) {
		const last4 = line.slice(i-14, i);
		const set = new Set(last4)
		if (set.size === 14) {
			return i;
		}
	}
};

export const solve2 = (raw: string): any => {
	const input = parseInput(raw);

	const line = input[0].split('');

	

	const map = new Map();
	
	for (let i = 0; i < line.length; i++) {
		const values = Array.from(map.values()).filter((v => v === 1));
		
		if (values.length === 14) {
			return i;
		}
		const curr = line[i];
		const last = line[i-14];
		
		map.set(curr, (map.get(curr) || 0) + 1);
		map.set(last, (map.get(last) || 0) - 1);
	}

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
		
		
		const time = Date.now();
		for (let i = 0; i < 1000; i++) {
			const actual = solve(input);
		}
		console.log(Date.now() - time);
		
	});

	it('passes input if exists', () => {
		const input = readInputFile();
		
		const time = Date.now();
		for (let i = 0; i < 1000; i++) {
			const actual = solve2(input);
		}
		console.log(Date.now() - time);
		
	});
})
