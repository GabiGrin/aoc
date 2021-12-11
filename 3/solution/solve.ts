// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';

const parseInput = (raw: string) => {
	const rows = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)

	return rows;
}

export const solve = (raw: string): any => {
	const input = parseInput(raw);

	const countInPos = (list, pos) => {
		const curr=  list.map(n => n[pos]);
		const ones = curr.filter(c => c === '1').length;
		const zeros = curr.filter(c => c === '0').length;
		return {ones, zeros}
	};

	const findNum = (list, pos, cond) => {
		if (list.length === 1) {
			return parseInt(list[0], 2);
		}
		const counts = countInPos(list, pos);
		const filtered = list.filter(r => r[pos] === cond(counts));
		return findNum(filtered, pos + 1, cond);
	}

	const ox = findNum(input, 0, cnt => cnt.ones >= cnt.zeros ? '1': '0');
	const co2 = findNum(input, 0, cnt => cnt.zeros <= cnt.ones ? '0': '1');

	return ox * co2;
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
		// const input = readInputFile();
		
		
		// const actual = solve(input);
		// console.log({actual});
	});
})
