// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { readInputFile } from '../runtime/lib/input-output-files';
import { entries, keys, memoize, range, sigma, simpleAdd, values } from './utils';

const parseInput = (raw: string) => {
	const rows = raw
		.split(',')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(Number)
		.reduce((acc, num) => {
			const c = acc.get(num) || 0;
			return acc.set(num, c+1);
		}, new Map())

	return rows;
}

const memoSigma = memoize(sigma);

export const solve = (raw: string): any => {
	const crabs = parseInput(raw);
	
	const minPosition = Math.min(...keys(crabs));
	const maxPosition = Math.max(...keys(crabs));

	const calcFuelPerCrab = (from, to) => memoSigma(Math.abs(from - to ));
	
	const calcFuel = (targetPos) => {
		return entries(crabs)
			.map(([pos, count]) => calcFuelPerCrab(targetPos, pos) * count)
			.reduce(simpleAdd)
	}

	return Math.min(...range(minPosition, maxPosition).map(calcFuel));
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

