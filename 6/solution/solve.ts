// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { finished } from 'stream';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { range } from './utils';

const parseInput = (raw: string) => {
	const fishMap = raw
		.split(',')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(Number)
		.reduce((acc, curr) => {
			acc[curr] = (acc[curr] || 0) + 1;
			return acc;
		}, []);
		
	return fishMap;
}

export const solve = (raw: string): any => {
	const initFish = parseInput(raw);

	return range(256).reduce((currFish) => {
		return currFish.reduce((fish, count, age) => {
			if (age === 0) {
				fish[6] = count;
				fish[8] = count;
			} else {
				fish[age - 1] = (fish[age - 1] || 0) + count;
			}
			return fish;
		}, []);
	}, initFish)
	.reduce((a, b) => a + b);
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
