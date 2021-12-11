// import { puzzleInput } from "../lib/lib";
import {assert} from 'chai';
import { getTestCases } from '../runtime/lib/get-tests';
import { calcNeighboursWithDiag, getCell, gridFromMatix, range, setCell } from './utils';

const parseInput = (raw: string) => {
	const matrix = raw
		.split('\n')
		.map(n => n.trim())
		.filter((v) => !!v)
		.map(r => r.split('').map(Number))
		
	return gridFromMatix(matrix);
}

export const solve = (raw: string): any => {
	let grid = parseInput(raw);

	let allFlashed = false;

	let step = 1;
	while(!allFlashed) {
		let flashes = 0;
		const toInc = grid.reduce((acc, _, pos) => [...acc, pos], []);

		while (toInc.length) {
			const currV = toInc.pop();
			let val = grid.get(currV);
			grid.inc(currV);
			
			if (val === 9) {
				flashes++;

				const adj = calcNeighboursWithDiag(currV)
					.filter(pos => {
						const v = grid.get(pos);
						return v < 10 && typeof v === 'number';
					})
				toInc.push(...adj);
			}
		}

		grid = grid.map(v => v > 9 ? 0 : v);

		allFlashed = flashes === 100;
		step++;
	}
	return step;

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
